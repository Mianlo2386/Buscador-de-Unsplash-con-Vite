import { useState, useEffect } from 'react';
import './App.css';
//import axios from 'axios';
import InfiniteScroll from "react-infinite-scroll-component"
import 'bootstrap-icons/font/bootstrap-icons.css'
import { motion } from "framer-motion";


function App() { 

  
  const [valor,setValor] = useState('');
  const [valorTag,setValorTag]=useState('')
  
  const [resultados,setResultados] = useState([]);
  const [page,setPage] = useState(1);

  const [resultadosTags,setResultadosTags] = useState([]); 
  const [pageTag, setPageTag] = useState(1);

  const [resultadosR,setResultadosR] = useState([]);
  const [pageR, setPageR] = useState(1); 

  const [variable,setVariable] = useState(1); // state =1 es random, =2 es search, =3 es tag



//const ACCESS_KEY = '65XiRXJUKphgomkJhahmT6rdhCdlm9_ALwKe-3ijO1w'
const ACCESS_KEY = 'fMk7uhDPagS3fp4IZ4y-6oh5qRzDcExDsFun33mJo-s'
//const ACCESS_KEY = 'iadbAe7GSBK7bhVU1GUBDF7Y3n0zoSEOpAMYObxFAkM'

/* funcion para busqueda de imagenes */

const buscarResultados= async ()=>{
  setVariable(1)
  let URL= `https://api.unsplash.com/search/photos/?client_id=${ACCESS_KEY}&query=${valor}&per_page=30&`; 
 
  const response= await fetch(URL);
  const data= await response.json();
  setResultados(data.results);
  console.log(data.results);  
}
// concatena imagenes de busqueda para scroll infinito
useEffect(()=>{
  if(!valor==''){ 
    const buscarResultados= async ()=>{
      let URL= `https://api.unsplash.com/search/photos/?client_id=${ACCESS_KEY}&query=${valor}&per_page=30&page=${page}`;    

                
      const response= await fetch(URL);
      const data= await response.json();
      setResultados((datosPrev)=>datosPrev.concat(data.results)); 
      
    }
      buscarResultados()
  }
},[page]) 



/* funcion para busqueda random cuando inicia la pagina y vaciamos el input */

useEffect(()=>{
  if(valor==''){ // aca no stoy seguro si va la comparacion con null
      const buscarRandom=async()=>{
        setVariable(2)
        let urlRandom=`https://api.unsplash.com/photos/random?count=30&client_id=${ACCESS_KEY}`;
    
         const response= await fetch(urlRandom);
         const data= await response.json();
         setResultadosR((data));

      }
      buscarRandom();
  }
  
},[valor]) 

/* funcion para concatenar paginas del infinite scroll tandom */
 useEffect(()=>{
  if(valor==='' || valor===null){
  const buscarRandom=async()=>{
    let urlRandom=`https://api.unsplash.com/photos/random?count=30&client_id=${ACCESS_KEY}&page=${pageR}`;

    const response= await fetch(urlRandom);
    const data= await response.json();
    setResultadosR((datosPrev)=>datosPrev.concat(data));
  }
  buscarRandom();
}

},[pageR])

/* funcion busqueda de imagenes de tags */

useEffect(()=>{
  if(!valor==''){
  const busquedaTags= async ()=>{
    
      setVariable(3)
    let URL= `https://api.unsplash.com/search/photos/?client_id=${ACCESS_KEY}&query=${valorTag}&per_page=30`;    
   
    const response= await fetch(URL);
    const data= await response.json();
    setResultadosTags(data.results); 
    setResultadosTags(data.results); 
      
    }
  busquedaTags()
}
},[valorTag]) 

/* funcion para concatenar busqueda con tags para infinite scroll*/

useEffect(()=>{
const busquedaTags= async ()=>{
  let URL= `https://api.unsplash.com/search/photos/?client_id=${ACCESS_KEY}&query=${valorTag}&per_page=30&page=${pageTag}`; 
 
  const response= await fetch(URL);
  const data= await response.json();
   
   setResultadosTags((datosPrev)=>datosPrev.concat(data.results));
  
                                   
}  
busquedaTags();
},[pageTag]) 




  
/* CAJA DE BUSQUEDA */

return (
    <> 
      <div >
        
        <div className='cajaDeBusqueda'>
          <input className='cajaDeBusqueda--input'
          type="text" 
          placeholder='Buscar...' 
          onChange={e=>setValor(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              buscarResultados();
            }
          }}
          />

          <button className='cajaDeBusqueda--btn' 
          onClick={()=>buscarResultados()}><i className="bi bi-search"></i></button>
        </div>
        
      </div>

      {/* INFINITE SCROLL DE SEARCH */}
    
      {
    variable==1
    &&  

    <InfiniteScroll dataLength={resultados.length} hasMore={true} next={()=>setPage(page+1)}>
      
    
      { 
      <div className='contenido'>{
        
      
        resultados.map((elemento,index)=> {
          return (
            <>
              <div className='contenido--fila'>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ rotate: 360, scale: 1 }}
                transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
                }}
                >
              <img key = {index}
               src={elemento.urls.regular} 
               alt="Imagen no disponible"
               
               onMouseOver={(e) => {
                e.currentTarget.classList.add("image-hover");
              }}
              onMouseOut={(e) => {
                e.currentTarget.classList.remove("image-hover");
              }} 
              
              onClick={() => {
                const nuevaPestana = window.open();
                nuevaPestana.document.body.innerHTML = `
                 <p><strong>Para descargar la imagen, haga click con el botón derecho sobre la imagen y seleccione "Guardar imagen como...        "</strong> <button className="boton--busqueda" id="volver-btn">Volver a la búsqueda</button> </p>
                 
                  <img src="${elemento.urls.regular}" alt="Imagen no disponible" />
                  
                `;
                 const volverBtn = nuevaPestana.document.getElementById('volver-btn');
                 volverBtn.addEventListener('click', () => {
                 nuevaPestana.close();
                 window.location.href = 'http://localhost:5173/Buscador-de-Unsplash-con-Vite/http://localhost:5173/Buscador-de-Unsplash-con-Vite/'; // redirige a la página de búsqueda
              });
              }}
                

              />
              </motion.div>


              <div className='info'>
                 <p><strong>Ubicación</strong>:{elemento.user.location ? (
                    <p>{elemento.user.location}</p>
                    ) : (
                  <p>No disponible</p>
                    )}
                    </p>
                 <p><strong>Cámara</strong>:{elemento.camera_description ? (
                    <p>{elemento.camera_description}</p>
                    ) : (
                    <p>No disponible</p>
                    )}
                 </p>
                    <p><strong>Tags</strong>:</p>               
                 {elemento.tags && elemento.tags.map((tag, index) => (
                   <a className='tags' key={index} onClick={() => setValorTag(tag.title)}><span>{tag.title}</span></a>
                        ))} 
                  
                  

              </div>
              
           
            
          </div>
           </>
          )
          
        })
        
      }
          
      </div> }
        
    
    </InfiniteScroll>
}

{/* INFINTE SCROLL DE RANDOM */}
{
variable==2
&&

    <InfiniteScroll dataLength={resultadosR.length} hasMore={true} next={()=>setPageR(pageR+1)}>
      
    
      { 
      <div className='contenido'>{
      
        resultadosR.map((elementoR,index)=> {
          return (
                      
               
              
              <div className='contenido--fila'>
                <motion.div
                initial={{ scale: 0 }}
                animate={{ rotate: 360, scale: 1 }}
                transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
                }}
                >
              
                <img key = {index}
                 src={elementoR.urls.regular} 
                 alt="Imagen no disponible"
                  onMouseOver={(e) => {
                  e.currentTarget.classList.add("image-hover");
                  }}
                  onMouseOut={(e) => {
                  e.currentTarget.classList.remove("image-hover");
                  }}   
                  
                  onClick={() => {
                    const nuevaPestana = window.open();
                    nuevaPestana.document.body.innerHTML = `
                      <p><strong>Para descargar la imagen, haga click con el botón derecho sobre la imagen y seleccione "Guardar imagen como...          "</strong> <button className="boton--busqueda" id="volver-btn">Volver a la búsqueda</button></p>
                      
                      <img src="${elementoR.urls.regular}" alt="Imagen no disponible" />
                      
                    `;
                     const volverBtn = nuevaPestana.document.getElementById('volver-btn');
                     volverBtn.addEventListener('click', () => {
                     nuevaPestana.close();
                     window.location.href = 'http://localhost:5173/Buscador-de-Unsplash-con-Vite/http://localhost:5173/Buscador-de-Unsplash-con-Vite/'; // redirige a la página de búsqueda
                  });
                  }} 
                  
                  
                  />

                  </motion.div>



              <div className='info'>
                 <p><strong>Ubicación</strong>: {elementoR.user.location ? (
                    <p>{elementoR.user.location}</p>
                    ) : (
                    <p>No disponible</p>
                    )}
                    </p>
                    <p><strong>Cámara</strong>: {elementoR.exif.name ? (
                    <p>{elementoR.exif.name}</p>
                    ) : (
                    <p>No disponible</p>
                    )}
                 </p>

                
                 <p><strong>Tags</strong>:</p>
                 <p>No disponibles</p>
              </div>
          </div>
            
            
          )
        })
      }
          
      </div> }
        
    
    </InfiniteScroll>  
}
{/* INFINITE SCROLL DE TAGS */}

    {
    variable==3
    &&  

    <InfiniteScroll dataLength={resultadosTags.length} hasMore={true} next={()=>setPageTag(pageTag+1)}>
      
    
      { 
      <div className='contenido'>{
        
      
        resultadosTags.map((elementoT,index)=> {
          return (
            <>
              <div className='contenido--fila'>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ rotate: 360, scale: 1 }}
                transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
                }}
                >
              <img key = {index}
               src={elementoT.urls.regular} 
               alt="Imagen no disponible"
               
               onMouseOver={(e) => {
                e.currentTarget.classList.add("image-hover");
              }}
              onMouseOut={(e) => {
                e.currentTarget.classList.remove("image-hover");
              }} 
              
              onClick={() => {
                const nuevaPestana = window.open();
                nuevaPestana.document.body.innerHTML = `
                 <p><strong>Para descargar la imagen, haga click con el botón derecho sobre la imagen y seleccione "Guardar imagen como...          "</strong> <button className="boton--busqueda" id="volver-btn">Volver a la búsqueda</button></p>
                  
                  <img src="${elementoT.urls.regular}" alt="Imagen no disponible" />
                  
                `;
                 const volverBtn = nuevaPestana.document.getElementById('volver-btn');
                 volverBtn.addEventListener('click', () => {
                 nuevaPestana.close();
                 window.location.href = 'http://localhost:5173/Buscador-de-Unsplash-con-Vite/http://localhost:5173/Buscador-de-Unsplash-con-Vite/'; // redirige a la página de búsqueda
              });
              }} 
                

              />
              </motion.div>


              <div className='info'>
                 <p><strong>Ubicación</strong>:{elementoT.user.location ? (
                    <p>{elementoT.user.location}</p>
                    ) : (
                  <p>No disponible</p>
                    )}
                    </p>
                 <p><strong>Cámara</strong>:{elementoT.camera_description ? (
                    <p>{elementoT.camera_description}</p>
                    ) : (
                    <p>No disponible</p>
                    )}
                 </p>
                    <p><strong>Tags</strong>:</p>               
                 {elementoT.tags && elementoT.tags.map((tag, index) => (
                   <a className='tags' key={index} onClick={() => setValorTag(tag.title)}><span>{tag.title}</span></a>
                        ))} 
                  
                  

              </div>
              
           
            
          </div>
           </>
          )
          
        })
        
      }
          
      </div> }
        
    
    </InfiniteScroll>
}
       
             
    </>

)
}
export default App











