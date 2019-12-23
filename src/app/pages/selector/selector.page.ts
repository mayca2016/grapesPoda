import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { Productor } from '../../interfaces/productor';
import { DbService } from 'src/app/services/db.service';
import { Storage } from '@ionic/storage';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

export interface Parcela {
  id_parcela: number;
  fincaparcela: string;
  identificacion: string;
}
export interface Planta {
  id_planta: number;
}

@Component({
  selector: 'selector',
  templateUrl: './selector.page.html',
  styleUrls: ['./selector.page.scss'],
})
export class SelectorPage implements OnInit, AfterViewInit, OnDestroy {

  protected grupo: any;
  protected opcion: any;

  /** list of banks */
  protected productor: Productor[] ;
  public parcela: Parcela[] ;
  public planta: Planta[];

  /** control for the selected bank */
  public prodCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public prodFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredProd: ReplaySubject<Productor[]> = new ReplaySubject<Productor[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  public selectedParcela: string;
  public selectedPlanta: string;

  constructor(
    private db:             DbService,
    private storage:        Storage,
    private activatedRoute: ActivatedRoute,
    private zone:           NgZone,
    private navCtrl:        NavController,
    private router:         Router,
    private dataService:    DataService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe( 
      (val)=>{
        this.opcion = val.get('opcion');
       
        console.log(this.opcion);
        
      }
    );
    this.storage.get('grupo').then(
      (val)=>{
        console.log("Grupo"+val);
        this.grupo=val;

        this.cargarBD().then(
          ()=>{
          // set initial selection
          this.prodCtrl.setValue(this.productor[10]);
    
          // load the initial bank list
          this.filteredProd.next(this.productor.slice());
    
          // listen for search field value changes
          this.prodFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
              this.filterBanks();
            });
          }
        ).catch();
        this.cargarBDParcela(1);
        this.cargarBDPlanta(1);
      }
    );
   
   
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredProd are loaded initially
   */
  protected setInitialValue() {
    this.filteredProd
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredProd are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: Productor, b: Productor) => a && b && a.id === b.id;
      });
  }

  protected filterBanks() {
    if (!this.productor) {
      return;
    }
    // get the search keyword
    let search = this.prodFilterCtrl.value;
    if (!search) {
      this.filteredProd.next(this.productor.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredProd.next(
      this.productor.filter(prod => prod.nombre.toLowerCase().indexOf(search) > -1)
    );
  }

  async cargarBD(){
    let sql;
    if(this.grupo == 6){
      sql="SELECT DISTINCT id_productor, nombre FROM parcelas ORDER BY nombre";
    }else{
      sql="SELECT DISTINCT id_productor, nombre FROM parcelas WHERE grupo="+this.grupo+" ORDER BY nombre";
    }
    
    await this.db.devolverTabla(sql).then(
      (productor)=>{
          this.productor = productor;
      }
    ).catch(
      error =>{
        console.log("Error devolver tabla productor"+error);
      }
    );

  }
  async cargarBDParcela(id){
    
    
    let sql="SELECT DISTINCT id_parcela, fincaparcela, identificacion FROM parcelas WHERE id_productor="+id+" ORDER BY fincaparcela";
    
    
    await this.db.devolverTabla(sql).then(
      (parcela)=>{
          this.parcela = parcela;
          console.log(parcela);
      }
    ).catch(
      error =>{
        console.log("Error devolver tabla productor"+JSON.stringify(error));
      }
    );

  }

  async cargarBDPlanta(id){
    
    
    let sql="SELECT DISTINCT id_planta FROM plantas WHERE id_parcela="+id;
    
    
    await this.db.devolverTabla(sql).then(
      (planta)=>{
          this.planta = planta;
          console.log(planta);
      }
    ).catch(
      error =>{
        console.log("Error devolver tabla planta"+JSON.stringify(error));
      }
    );

  }

  async selectParcelas(){
    console.log( "ddd"+this.prodCtrl.value.id_productor);
    this.cargarBDParcela(this.prodCtrl.value.id_productor);

  }
  async selectPlanta(){
    console.log( "parcela"+this.selectedParcela);
    this.cargarBDPlanta(this.selectedParcela);

  }

  irConteo(){
    console.log("pl"+this.selectPlanta);
    let dato = {
      planta: this.selectedPlanta,
      parcela: this.selectedParcela ,
      idApp:0   }
    
    
     
    this.zone.run(async () => {

      this.navCtrl.navigateForward(['/'+this.opcion+'/'+JSON.stringify(dato)+'/0'], {animated:true});
      //this.router.navigate([this.opcion], navigationExtras);
      
    });
 
  }
}

