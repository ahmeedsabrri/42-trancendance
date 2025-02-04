import { Bounce, toast } from 'react-toastify';

const sendMessage = (type: string ,socket: WebSocket, reciever_id: number, message: string, sender_id: number, conversation_id: number) => {
    socket.send(JSON.stringify({type: type, reciever_id: reciever_id, message: message, conversation_id: conversation_id, time: new Date().toISOString()}));
    console.log("Message Sent");
    console.log("Message Object: ", {type: type, reciever_id: reciever_id, message: message, conversation_id: conversation_id, time: new Date().toISOString()});
}

  export const notifyAdd = (message:string) => toast(message,{
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  });

  export const notifyErr = (message:string) => toast(message,{
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  });

export { sendMessage };