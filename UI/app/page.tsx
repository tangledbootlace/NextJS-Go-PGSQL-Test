'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Item {
  id: number
  challenge_name: string
  challenge_attribute: string
  challenge_attribute_value: string
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [newItem, setNewItem] = useState({
    challenge_name: '',
    challenge_attribute: '',
    challenge_attribute_value: '',
  })

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
      body: JSON.stringify(newItem),
    })
    setNewItem({
      challenge_name: '',
      challenge_attribute: '',
      challenge_attribute_value: '',
    })
    fetchItems() // Refetch the items
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Item List</h1>
      <form onSubmit={addItem} className="mb-4 space-y-2">
        <div>
          <Input
            type="text"
            value={newItem.challenge_name}
            onChange={(e) => setNewItem({ ...newItem, challenge_name: e.target.value })}
            placeholder="Challenge Name"
            className="mr-2"
          />
        </div>
        <div>
          <Input
            type="text"
            value={newItem.challenge_attribute}
            onChange={(e) => setNewItem({ ...newItem, challenge_attribute: e.target.value })}
            placeholder="Challenge Attribute"
            className="mr-2"
          />
        </div>
        <div>
          <Input
            type="text"
            value={newItem.challenge_attribute_value}
            onChange={(e) => setNewItem({ ...newItem, challenge_attribute_value: e.target.value })}
            placeholder="Attribute Value"
            className="mr-2"
          />
        </div>
        <Button type="submit">Add Item</Button>
      </form>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Challenge Name</th>
            <th className="border border-gray-300 px-4 py-2">Challenge Attribute</th>
            <th className="border border-gray-300 px-4 py-2">Attribute Value</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-300 px-4 py-2">{item.id}</td>
              <td className="border border-gray-300 px-4 py-2">{item.challenge_name}</td>
              <td className="border border-gray-300 px-4 py-2">{item.challenge_attribute}</td>
              <td className="border border-gray-300 px-4 py-2">{item.challenge_attribute_value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

