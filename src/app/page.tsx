import AddRoom from "@/components/AddRoom"
export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Video Call App</h1>
      <AddRoom />
    </main >
  )
}

