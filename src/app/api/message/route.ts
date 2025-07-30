import { db } from '@/db'
import { gemini, model } from '@/lib/gemini'
import { SendMessageValidator } from '@/lib/validators/SendMessageValidator'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { PineconeStore } from '@langchain/pinecone'
import { NextRequest, NextResponse } from 'next/server'

import { Pinecone } from '@pinecone-database/pinecone'

export const POST = async (req: NextRequest) => {
  // endpoint for asking a question to a pdf file

  const body = await req.json()

  const { getUser } = getKindeServerSession()
  const user = getUser()

  const { id: userId } = user

  if (!userId)
    return new Response('Unauthorized', { status: 401 })

  const { fileId, message } =
    SendMessageValidator.parse(body)

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId,
    },
  })

  if (!file)
    return new Response('Not found', { status: 404 })

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId,
    },
  })

  // 1: vectorize message
  console.log('DEBUG: GEMINI_API_KEY for embeddings:', process.env.GEMINI_API_KEY);
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
  })

  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY||"na"
  });
      
  const pineconeIndex = pc.Index('pagewise')

  const vectorStore = await PineconeStore.fromExistingIndex(
    embeddings,
    {
      pineconeIndex,
      namespace: file.id,
    }
  )

  const results = await vectorStore.similaritySearch(
    message,
    4
  )

  const prevMessages = await db.message.findMany({
    where: {
      fileId,
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 6,
  })

  const formattedPrevMessages = prevMessages.map((msg) => ({
    role: msg.isUserMessage
      ? ('user' as const)
      : ('model' as const),
    parts: msg.text,
  }))

  const prompt = `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. 
If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------

PREVIOUS CONVERSATION:
${formattedPrevMessages.map((message) => {
              if (message.role === 'user')
                return `User: ${message.parts}\n`
              return `Model: ${message.parts}\n`
            }).join('')}
----------------

CONTEXT:
${results.map((r) => r.pageContent).join('\n\n')}\n\nUSER INPUT: ${message}`;

  const cerebrasResponse = await fetch('https://api.cerebras.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY}`
    },
    body: JSON.stringify({
      model: 'qwen-3-235b-a22b-instruct-2507',
      messages: [{
        role: 'user',
        content: prompt
      }],
      stream: false
    })
  });

  const responseData = await cerebrasResponse.json();
  const acc = responseData.choices[0].message.content;

  await db.message.create({
    data: {
      text: acc,
      isUserMessage: false,
      fileId,
      userId,
    },
  })

  return new NextResponse(acc)
}