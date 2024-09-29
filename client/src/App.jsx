import {ethers} from "ethers"
import { useState } from "react"
import Form from "./components/Form"
import artifact from "../../build/contracts/Pii.json"
function App() {
  const [account, setAccount] = useState(null)
  const [provider, SetProvider] = useState(null)
  const [signer, SetSigner] = useState(null)
  const [contract, SetContract] = useState(null)
  const contractAddress = "0x869f8E03d180f9a8CFBbb3A8A7dCd073eaE4c095"
  const abi = artifact.abi
  async function connectMetamask(){
    if(window.ethereum){
        window.ethereum.request({ method: 'eth_requestAccounts' }).then(async (accounts)=>{
          setAccount(accounts[0])
          const provider = new ethers.BrowserProvider(window.ethereum)
          const signer = await provider.getSigner()
          SetProvider(provider)
          SetSigner(signer)
          const contract = new ethers.Contract(contractAddress, abi, signer)
          SetContract(contract)
        })
      } 
    }
  
  return (
    <div className="w-full h-screen flex items-center justify-center ">
      <div className="flex flex-col gap-9 border-2 border-black p-[100px] rounded-lg ">
        <p className="text-5xl font-bold">Data Gaurdian Prototype by Chmod 777</p>
      {!account && <button onClick={connectMetamask} className="border-2 border-black px-4 py-4 rounded-md">Connect Wallet</button>}
      {account && <p className="text-xl ">Account Connected Successfully {account} <Form contract={contract}/></p>}
      </div>
    </div>
  )
}

export default App
