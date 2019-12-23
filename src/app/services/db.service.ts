import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';


@Injectable({
  providedIn: 'root'
})
export class DbService {
  db : SQLiteObject = null;

  constructor(
    private sqlite : SQLite
  ) { }

   /** INICIAR BD */
   public initDatabase(){

    return this.sqlite.create({
      name:'poda.db',
      location:'default'
    }).then((db: SQLiteObject)=>{

      if(this.db === null){
        this.db=db;
        console.log("Base de datos creada");
      }
     
    }).catch(
      error=>{
        console.log("Error al crear la bd");
      }
    );
  }

   /**
   * METODO PARA CREAR TABLAS
   * @param sql 
   */
  createTable(sql){
    
    return this.db.executeSql(sql, []);
  }

  /**
   * METODO PARA ELIMNIAR TABLAS
   * @param sql 
   */
  borrarTabla(sql){
    return this.db.executeSql(sql, []);
  }

   /**
   * COMPROBAR SI EXISTE UNA TABLA
   * @param sql 
   */
  public comprobarTabla(sql){
    return new Promise((resolve, reject)=>{
      this.db.executeSql(sql, []).then(
        (data) => {
          let existe;
        if (data.rows.length > 0) {
            existe="si;"
            
         
        }else{
        existe="no";
        }
        resolve(existe);
      }, (error) => {
        reject(error);
      })
    })
  }

  /**
   * DEVOLVER DATOS DE UNA TABLA
   * @param sql 
   */
  public devolverTabla(sql){
    return this.db.executeSql(sql, [])
    .then(
      response =>{
        let array = [];
        for(let index=0; index<response.rows.length; index++){
          array.push(response.rows.item(index));
        }
        return Promise.resolve(array);
      }
    )
    .catch(
      error=> Promise.reject(error)
    )
  }

  /**
   * INSERTAR DATOS
   * @param insertRows 
   */
  public insertar(insertRows){
    return this.db.sqlBatch(insertRows);
  }

  /**
   * INSERTA DATOS
   * @param sql 
   * @param datos 
   */
  public insertar1(sql,datos){
    return this.db.executeSql(sql, datos);
  }

/********************************************UPDATE******************************** */

  public modficarConteoPoda(id,datos){
    let marcada;
    if(datos.marcada ==false){
      marcada=0;
    }else{
      marcada=1
    }
    let sql = "UPDATE conteo_poda SET uveros = ?, brocadas = ?, t1=?, t2 = ?, t3 = ?, t4 = ?, ybrocadas = ?, marcada = ?, valoracion = ?, observacion = ? WHERE id_conteoAPP = "+id;
    return this.db.executeSql(sql, [datos.uveros, datos.brocadas, datos.t1, datos.t2, datos.t3, datos.t4, datos.ybrocadas, marcada, datos.valoracion, datos.observacion]);
  }  

  public modificarEnvio(tabla,campo,id, valor){
    let sql = "UPDATE "+tabla+" SET enviado=? WHERE "+campo+"="+id;
    return this.db.executeSql(sql,[valor])
  }
  public modificarEnvioTodos(tabla){
    let sql = "UPDATE "+tabla+" SET enviado=? WHERE enviado IS NOT 1";
    return this.db.executeSql(sql,[1])
  }
}
