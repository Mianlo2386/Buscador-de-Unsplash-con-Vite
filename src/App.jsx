import { useState, useEffect } from 'react';
import './App.css';
//import axios from 'axios';
import InfiniteScroll from "react-infinite-scroll-component"
import 'bootstrap-icons/font/bootstrap-icons.css'



function App() { 

  
  const [valor,setValor] = useState('');
  const [resultados,setResultados] = useState([]);
  const [resultadosTags,setResultadosTags] = useState([]); 
  const [resultadosR,setResultadosR] = useState([]);
  const [page,setPage] = useState(1);
  const [variable,setVariable] = useState(true);


const ACCESS_KEY = '65XiRXJUKphgomkJhahmT6rdhCdlm9_ALwKe-3ijO1w'
//const ACCESS_KEY = 'fMk7uhDPagS3fp4IZ4y-6oh5qRzDcExDsFun33mJo-s'
//const ACCESS_KEY = 'iadbAe7GSBK7bhVU1GUBDF7Y3n0zoSEOpAMYObxFAkM'
  /* const URL1 = `https://api.unsplash.com/photos/random?count=6&client_id=${ACCESS_KEY2}&page=1`
  const URL2 = `https://api.unsplash.com/search/photos?client_id=${ACCESS_KEY2}&query=${valor}&per_page=6&page=${page}` */


/* funcion para busqueda de imagenes */
const buscarResultados= async ()=>{
  setVariable(false)
  let URL= `https://api.unsplash.com/search/photos/?client_id=${ACCESS_KEY}&query=${valor}&per_page=30&`; 
 
  const response= await fetch(URL);
  const data= await response.json();
  setResultados(data.results);
  console.log(data.results);  
}
useEffect(()=>{
const busquedaTags= async ()=>{
  let URL= `https://api.unsplash.com/search/photos/?client_id=${ACCESS_KEY}&query=${resultadosTags}&per_page=30&`; 
 
  const response= await fetch(URL);
  const data= await response.json();
   setResultados(data.results); 
  
  
                                   
}  
busquedaTags();
},[resultadosTags]) 


/* funcion para buscar si cambia de pagina */
useEffect(()=>{
  const buscarResultados= async ()=>{
    if(valor==='' || valor===null){
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
  if(valor==='' || valor===null){
      const buscarRandom=async()=>{
        setVariable(true)
        let urlRandom=`https://api.unsplash.com/photos/random?count=30&client_id=${ACCESS_KEY}`;
    
         const response= await fetch(urlRandom);
         const data= await response.json();
         setResultadosR((data));

      }
      buscarRandom();
  }
  
},[valor]) 

/* funcion para concatenar paginas del infinte scroll */
 useEffect(()=>{
  if(valor==='' || valor===null){
  const buscarRandom=async()=>{
    let urlRandom=`https://api.unsplash.com/photos/random?count=30&client_id=${ACCESS_KEY}&page=${page}`;

    const response= await fetch(urlRandom);
    const data= await response.json();
    setResultadosR((datosPrev)=>datosPrev.concat(data));
  }
  buscarRandom();
}

},[valor,page]) 

return (
    <> 
      <div >
        
        <div className='CajaDeBusqueda'>
          <input className='CajaDeBusqueda--input'
          type="text" 
          placeholder='Buscar...' 
          onChange={e=>setValor(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              buscarResultados();
            }
          }}
          />

          <button className='CajaDeBusqueda--btn' 
          onClick={()=>buscarResultados()}><i className="bi bi-search"></i></button>
        </div>
        
      </div>
    {
    variable==false
    &&  

    <InfiniteScroll dataLength={resultados.length} hasMore={true} next={()=>setPage(page+1)}>
      
    
      { 
      <div className='contenido'>{
      
        resultados.map((elemento,index)=> {
          return (
            <div className='contenido--fila'>
              <img key = {index}
               src={elemento.urls.regular} 
               alt="Imagen no disponible"
               onMouseOver={(e) => {
                e.currentTarget.classList.add("image-hover");
              }}
              onMouseOut={(e) => {
                e.currentTarget.classList.remove("image-hover");
              }}
              onClick={() => window.open(elemento.urls.regular, '_blank')}
              />
              <div className='info'>
                 <p><strong>Ubicación:</strong> {elemento.user.location ? (
                    <p className='location-description'>{elemento.user.location}</p>
                    ) : (
                  <p className='location-description'>No disponible</p>
                    )}
                    </p>
                 <p><strong>Cámara:</strong> {elemento.camera_description ? (
                    <p className='camera-description'>{elemento.camera_description}</p>
                    ) : (
                    <p className='camera-description'>No disponible</p>
                    )}
                 </p>
                    <p><strong>Tags:</strong></p>               
                 {elemento.tags && elemento.tags.map((tag, index) => (
                   <a className='tags' key={index} onClick={() => setResultadosTags(tag.title)}><span>{tag.title}</span></a>
                        ))} 
                  
                  

              </div>
          </div>
          )
        })
      }
          
      </div> }
        
    
    </InfiniteScroll>
}
    <InfiniteScroll dataLength={resultados.length} hasMore={true} next={()=>setPage(page+1)}>
      
    
      { 
      <div className='contenido'>{
      
        resultadosR.map((elementoR,index)=> {
          return (
            <div className='contenido--fila'>
              <img key = {index}
               src={elementoR.urls.regular} 
               alt="Imagen no disponible"
               onMouseOver={(e) => {
                e.currentTarget.classList.add("image-hover");
              }}
              onMouseOut={(e) => {
                e.currentTarget.classList.remove("image-hover");
              }}
              onClick={() => window.open(elementoR.urls.regular, '_blank')}/>
              <div className='info'>
                 <p><strong>Ubicación:</strong> {elementoR.user.location ? (
                    <p className='location-description'>{elementoR.user.location}</p>
                    ) : (
                    <p className='location-description'>No disponible</p>
                    )}
                    </p>
                    <p><strong>Cámara:</strong> {elementoR.exif.name ? (
                    <p className='camera-description'>{elementoR.exif.name}</p>
                    ) : (
                    <p className='camera-description'>No disponible</p>
                    )}
                 </p>

                 {/* <p>Cámara: {elementoR.exif.name} </p> */}
                 <p><strong>Tags:</strong></p>
                 <p>No disponibles</p>
              </div>
          </div>
          )
        })
      }
          
      </div> }
        
    
    </InfiniteScroll>  
       
             
    </>

)
}
export default App













//142 onClick={() => window.open(elemento.urls.regular, '_blank')}