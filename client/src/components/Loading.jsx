import React from 'react'

const Loading = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

export default Loading
