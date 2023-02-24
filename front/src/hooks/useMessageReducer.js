export const initialState = {
  messages: [],
  nbMessages: 0,
  errorMessage: undefined,
}

export const reducer = (state, action) => {
  console.log('reducer used')
  switch (action.type) {
    //payload: messages[]
    case 'addMessages': {
      let _messages = [...state.messages]
      action.payload.forEach((element) => {
        _messages.push(element)
      })
      return { ...state, messages: _messages, nbMessages: _messages.length }
    }
    case 'addMessage': {
      const _messageList = [action.payload, ...state.messages]
      return {
        ...state,
        messages: _messageList,
        nbMessages: _messageList.length,
      }
    }
    case 'likeMessage': {
      console.log(action.payload)
      console.log(state)
      let likedMessages = [...state.messages].map((message) => {
        if (action.payload.postID === message.id) {
          if (action.payload.operation === 'increment') {
            return {
              ...message,
              likes: message.likes + 1,
              liked_by_user: action.payload.initBy,
            }
          } else {
            return { ...message, likes: message.likes - 1, liked_by_user: null }
          }
        } else {
          return message
        }
      })
      return { ...state, messages: [...likedMessages] }
    }
    case 'updateMessageAuthor': {
      console.log(action)
      console.log(JSON.stringify(state))
      const updatedAuthorMessageList = [...state.messages].map((message) => {
        console.log(message)
        if (message.author_id === action.payload.id) {
          message.author_name = action.payload.name
          message.author_firstname = action.payload.firstname
          message.author_profile_picture_url =
            action.payload.profile_picture_url
        }
        console.log(message)
        return message
      })
      console.log(updatedAuthorMessageList)
      return { ...state, messages: updatedAuthorMessageList }
    }
    case 'deleteMessage': {
      console.log('deleteMessage', action.payload)
      const _fitleredMessages = state.messages.filter(
        (message) => message.id !== action.payload.id
      )
      console.log(_fitleredMessages)
      return {
        ...state,
        messages: _fitleredMessages,
        nbMessages: _fitleredMessages.length,
      }
    }
    case 'updateMessage': {
      console.log(action.payload)
      const messageUpdates = action.payload
      const updatedMessageList = [...state.messages].map((message) => {
        if (message.id === messageUpdates.id) {
          if (messageUpdates.picturesIdToDelete.length)
            messageUpdates.picturesIdToDelete.forEach((pictureIdToDelete) => {
              delete message.pictures[pictureIdToDelete]
            })
          if (messageUpdates.newPictures.length)
            messageUpdates.newPictures.forEach((newPicture) => {
              message.pictures[newPicture.id] = newPicture.url
            })
          console.log(JSON.stringify(message))
          return {
            ...message,
            amend_date: messageUpdates.amend_date,
            text_content: messageUpdates.text_content,
          }
        } else {
          return message
        }
      })
      console.log(JSON.stringify(updatedMessageList[0]))
      return {
        ...state,
        messages: [...updatedMessageList],
        nbMessages: updatedMessageList.length,
      }
    }
    default:
      throw new Error(`action.type not supported: ${action.type}`)
  }
}
