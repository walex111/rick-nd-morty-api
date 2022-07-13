import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { prisma } from '../lib/prisma'

interface Notes {
  notes: {
    id: string
    title: string
    content: string
  }[]
}

interface FormData {
  title: string
  content: string
  id: string
}

const Home = ({ notes }: Notes) => {
  const [form, setForm] = useState<FormData>({ title: '', content: '', id: '' })
  const router = useRouter()

  const refreshData = () => {
    router.replace(router.asPath)
  }

  const create = async (data: FormData) => {
    try {
      fetch('http://localhost:3000/api/create', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }).then(() => {
        if (data.id) {
          deleteNote(data.id)
          setForm({ title: '', content: '', id: '' })
          refreshData()
        } else {
          setForm({ title: '', content: '', id: '' })
          refreshData()
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const deleteNote = async (id: string) => {
    try {
      fetch(`http://localhost:3000/api/note/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      }).then(() => {
        refreshData()
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (data: FormData) => {
    try {
      create(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <h1 className="mt-4 text-center text-2xl font-bold">Notes</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(form)
        }}
        className="mx-auto flex w-auto min-w-[25%] max-w-min flex-col items-stretch space-y-6"
      >
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border-grey-300 rounded border-2 p-1"
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="border-grey-300 rounded border-2 p-1"
        />
        <button type="submit" className="rounded bg-black p-1 text-white">
          Add +
        </button>
      </form>
      <div className="mx-auto mt-5 flex w-auto min-w-[25%] flex-col items-center space-y-6">
        <ul>
          {notes.map((note) => (
            <li
              key={note.id}
              className="mx-auto w-auto min-w-[25%] border-b border-green-300 p-2"
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  <h3 className="font-bold">{note.title}</h3>
                  <p className="text-sm">{note.content}</p>
                </div>
                <button
                  onClick={() =>
                    setForm({
                      title: note.title,
                      content: note.content,
                      id: note.id,
                    })
                  }
                  className="rounded bg-blue-300 px-3 text-white"
                >
                  update
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="rounded bg-red-300 px-3 text-white"
                >
                  x
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const notes = await prisma.note.findMany({
    select: {
      title: true,
      id: true,
      content: true,
    },
  })

  return {
    props: {
      notes,
    },
  }
}
