"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState, use } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { EventImageUpload } from '@/components/events/EventImageUpload'
import { getEvent, updateEvent } from '@/lib/db/events'
import type { Event } from '@/lib/db/events'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Record<string, string>
}

export default function EventImageUploadPage({ params: paramsPromise }: PageProps) {
  const params = use<{id: string}>(paramsPromise)
  const router = useRouter()
  const form = useForm()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEvent(params.id)
        if (!eventData) {
          throw new Error('Event not found')
        }
        setEvent(eventData)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (!event) return <div>Event not found</div>

  const handleSubmit = async (data: any) => {
    try {
      if (!data.image) {
        throw new Error('No image selected')
      }

      // Update event with new image URL
      const updatedEvent = await getEvent(params.id)
      if (!updatedEvent) {
        throw new Error('Event not found')
      }

      setLoading(true)
      try {
        await updateEvent(params.id, { image: data.image })
        router.push(`/events/${params.id}`)
      } catch (error) {
        console.error('Failed to update event image:', error)
        form.setError('root', {
          message: 'Failed to save image to database'
        })
      } finally {
        setLoading(false)
      }
    } catch (error) {
      form.setError('root', {
        message: error instanceof Error ? error.message : 'Failed to save image'
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload Cover Image for {event.name}</h1>
      
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <EventImageUpload 
          form={form}
          eventId={params.id}
          currentImage={event.image}
        />

        <div className="flex gap-4">
          <Button type="submit" className="w-full">
            Save Changes
          </Button>
          <Button
            type="button"
            className="border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground w-full"
            onClick={() => router.push(`/events/${params.id}`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
