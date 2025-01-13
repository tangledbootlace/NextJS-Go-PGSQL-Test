'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Home() {
  const [items, setItems] = useState<string[]>([])
  const [newItem, setNewItem] = useState('')

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    const response = await fetch('http://localhost:8080/items')
    const data = await response.json()
    setItems(data)
  }

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('http://localhost:8080/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newItem }),
    })
    setNewItem('')
    fetchItems()
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Item List</h1>
      <form onSubmit={addItem} className="mb-4">
        <Input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Enter a new item"
          className="mr-2"
        />
        <Button type="submit">Add Item</Button>
      </form>
      <ul>
        {items.map((item, index) => (
          <li key={index} className="mb-2">{item}</li>
        ))}
      </ul>
    </main>
  )
}

