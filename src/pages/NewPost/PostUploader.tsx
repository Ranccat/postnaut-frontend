import React, { useState } from 'react'
import postService from '@/services/postService'
import useAlert from '@/hooks/useAlert'

const PostUploader: React.FC = () => {
  const { showPostSuccess, showPostFail } = useAlert()

  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [isSending, setIsSending] = useState<boolean>(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!content) {
      showPostFail("Must fill in the content")
      return
    }
    
    setIsSending(true);
    
    try {
      await postService.newPost(title, content)
      setTitle('')
      setContent('')
      showPostSuccess()
    } catch (error) {
      if (error instanceof Error) {
        showPostFail(error.message)
      }
      showPostFail("Unknown error occurred")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="w-1/2 mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Upload Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title (optional):</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your content here"
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className={`w-full p-3 rounded-md text-white ${isSending ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none`}
            disabled={isSending}
          >
            {isSending ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PostUploader
