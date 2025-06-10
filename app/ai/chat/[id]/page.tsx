import AIChatInterface from "@/app/ai/chat/ai-chat-interface"

interface Props {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function Page({ params, searchParams }: Props) {
  const id = params.id
  return (
    <div>
      <AIChatInterface chatId={id} />
    </div>
  )
}
