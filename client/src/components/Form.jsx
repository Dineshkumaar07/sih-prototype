import {useState, useEffect} from "react"
import axios from "axios"
const Form = ({contract}) => {
    useEffect(()=>{
        if(!contract) return;
        retreiveDocuments()
        console.log(contract)
    },[contract])
    const [cid, setCid] = useState('')  
    const [file, setFile] = useState(null)
    const [name, setName] = useState('')
    const [documents, setDocuments] = useState([])
    async function storeDocument(e){
        e.preventDefault()
        if(!file) return;
        const formData = new FormData();
        formData.append('file', file);
        await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        }).then((res)=>{
            setCid(res.data.cid)
            console.log(res.data.cid)
            contract.insertDocument(name,res.data.cid).then((res)=>{
                console.log('Document Stored Successfully')
            }).catch((err)=>{     
                alert('Error Storing Document')
            })
        });

    }
    function handleFileChange(e){
        setFile(e.target.files[0])
    }
    function retreiveDocuments(){
        contract.getDocuments().then((res)=>{
            console.log(res)
            const formattedData = res.map((data)=>{return {cid: data.cid, name: data.name}})
            console.log(formattedData)   
            setDocuments(formattedData)         
        }).catch((err)=>{   
            console.log(err)
        })
    }
    async function downloadDocument(cid){
        try {
            const response = await axios.get(`http://localhost:3001/retrieve/${cid}`, {
              responseType: 'blob', 
            });
      
            const url = window.URL.createObjectURL(new Blob([response.data])); 
            const a = document.createElement('a'); 
            a.href = url;
            a.download = 'document.pdf'; 
            document.body.appendChild(a); 
            a.click(); 
            a.remove(); 
            window.URL.revokeObjectURL(url); 
          } catch (error) {
            console.error('Error downloading file:', error);
          }
      
    }
    const inputStyle = "focus:outline-none border-2 border-black/50 p-3 rounded-lg font-normal" 
    const buttonStyle = "px-3 px-4 py-2 bg-black text-white rounded-lg w-fit"
  return (
    <div className="flex flex-col gap-6">
        
        <form onSubmit={storeDocument} className="flex flex-col gap-5 mt-9">
            <p>Upload File :</p>
            <input type="text" placeholder='Name of the Document' value={name} onChange={(e)=>setName(e.target.value)} className={inputStyle}/>
            <input type="file" onChange={handleFileChange}/>
            <button type="submit" className={buttonStyle}>Submit</button>
        </form>
        <p>Stored Documents: </p>
        {documents.length > 0 && <table className=" bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="">
                <tr className="bg-gray-200 text-gray-600 uppercase  leading-normal ">
                    <th className="p-2">Name</th>
                    <th>CID</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody className="text-gray-600 ">
                {documents.map((data, index)=>{
                    return <tr
                        className="border-b border-gray-300 hover:bg-gray-100 cursor-pointer " 
                        key={data.cid}>
                        <td className="p-3">{data.name}</td>
                        <td>{data.cid}</td>
                        <td><button onClick={()=>downloadDocument(data.cid)}>Download</button></td>
                    </tr>
                })}
            </tbody>

            </table>}
        {documents.length === 0 && <p>No Documents Found</p>}   
        
    </div>
  )
}

export default Form