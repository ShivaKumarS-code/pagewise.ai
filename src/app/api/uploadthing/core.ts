import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import {
  createUploadthing,
  type FileRouter,
} from 'uploadthing/next'

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { PineconeStore } from '@langchain/pinecone'
import { Pinecone } from '@pinecone-database/pinecone'

const f = createUploadthing();

const middleware = async () => {
  console.log('=== Middleware Started ===');
  
  try {
    const { getUser } = getKindeServerSession()
    console.log('Got Kinde server session');
    
    const user = getUser() // Remove await - this is synchronous
    console.log('User from getUser():', user ? 'User exists' : 'No user');
    console.log('User ID:', user?.id);

    if (!user || !user.id) {
      console.error('User authentication failed');
      throw new Error('Unauthorized')
    }

    console.log('Middleware completed successfully, User ID:', user.id);
    return { userId: user.id }
  } catch (error) {
    console.error('=== Middleware Error ===');
    console.error('Error:', error);
    throw error;
  }
}

const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>
  file: {
    key: string
    name: string
    url: string
  }
}) => {
  console.log('=== Upload Complete Started ===');
  console.log('File:', file.name, 'Key:', file.key);
  console.log('User ID:', metadata.userId);
  console.log('File URL:', file.url);

  let blob: Blob | undefined;
  let pageLevelDocs: any[] = [];
  let embeddings: GoogleGenerativeAIEmbeddings | undefined;
  let pineconeIndex: any; // Type as per Pinecone client's Index type

  try {
    const isFileExist = await db.file.findFirst({
      where: {
        key: file.key,
      },
    });

    if (isFileExist) {
      console.log('File already exists, skipping processing');
      return;
    }

    console.log('Creating file record in database...');
    const createdFile = await db.file.create({
      data: {
        key: file.key,
        name: file.name,
        userId: metadata.userId,
        url: file.url,
        uploadStatus: 'PROCESSING',
      },
    });
    console.log('File record created:', createdFile.id);

    try {
      console.log('Checking environment variables...');
      if (!process.env.PINECONE_API_KEY) {
        throw new Error('PINECONE_API_KEY is not set');
      }
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set');
      }
    } catch (envErr) {
      console.error('Error checking environment variables:', envErr);
      throw envErr;
    }

    try {
      console.log('Fetching PDF from URL...');
      const response = await fetch(file.url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      }
      console.log('Converting to blob...');
      blob = await response.blob();
      console.log('Blob size:', blob.size, 'bytes');
    } catch (fetchErr) {
      console.error('Error fetching or converting PDF:', fetchErr);
      throw fetchErr;
    }

    try {
      console.log('Loading PDF...');
      const loader = new PDFLoader(blob as Blob); // Cast blob to Blob
      pageLevelDocs = await loader.load();
      const pagesAmt = pageLevelDocs.length;
      console.log('PDF loaded with', pagesAmt, 'pages');

      if (pagesAmt === 0) {
        throw new Error('PDF appears to be empty');
      }
    } catch (loadErr) {
      console.error('Error loading PDF:', loadErr);
      throw loadErr;
    }

    try {
      console.log('Initializing Pinecone...');
      const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!
      });
          
      pineconeIndex = pc.Index('pagewise');
      console.log('Pinecone index initialized');
    } catch (pineconeInitErr) {
      console.error('Error initializing Pinecone:', pineconeInitErr);
      throw pineconeInitErr;
    }

    try {
      console.log('Initializing embeddings...');
      embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY!,
      });
      console.log('Embeddings initialized');
    } catch (embeddingsInitErr) {
      console.error('Error initializing embeddings:', embeddingsInitErr);
      throw embeddingsInitErr;
    }

    try {
      console.log('Creating and storing embeddings...');
      await PineconeStore.fromDocuments(
        pageLevelDocs,
        embeddings,
        {
          pineconeIndex,
          namespace: createdFile.id,
        }
      );
      console.log('Embeddings stored successfully');
    } catch (storeErr) {
      console.error('Error creating and storing embeddings:', storeErr);
      throw storeErr;
    }

    console.log('Updating file status to SUCCESS...');
    await db.file.update({
      data: {
        uploadStatus: 'SUCCESS',
      },
      where: {
        id: createdFile.id,
      },
    });
    console.log('File processing completed successfully');

  } catch (err) {
    console.error('=== ERROR IN UPLOAD PROCESSING (Outer Catch) ===');
    console.error('Error type:', typeof err);
    console.error('Error:', err);
    
    if (err instanceof Error) {
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
    }
    
    // Try to update file status to FAILED if we have a createdFile
    try {
      // We need to find the file again since createdFile might not be in scope
      const fileToUpdate = await db.file.findFirst({
        where: { key: file.key }
      });
      
      if (fileToUpdate) {
        await db.file.update({
          data: {
            uploadStatus: 'FAILED',
          },
          where: {
            id: fileToUpdate.id,
          },
        });
        console.log('File status updated to FAILED');
      }
    } catch (updateErr) {
      console.error('Failed to update file status:', updateErr);
    }
    
    // Re-throw the error so uploadthing knows something went wrong
    throw err;
  }
}

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: '16MB' } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter