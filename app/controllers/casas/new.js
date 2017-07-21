import Ember from 'ember';
import Materialize from 'materialize';

export default Ember.Controller.extend({

    calleSeleccionada: null,

    cambiLaCalle: Ember.observer('calleSeleccionada', 'model', function() {
        let casa = this.get('casa');
        let laCalle = this.calleSeleccionada;
        casa.set('calle', laCalle);
        this.set('casa.calle', laCalle)
        console.log(casa.calle);
        console.log(`calle: ${this.get('calleSeleccionada')}`);
    }),

	propietariosSeleccionados: [],

    actions: {
        calleSelected(calle) {
Materialize.toast(calle, 5000, 'rounded transparent black-text');
					this.set('calleSeleccionada', calle);
        },

        propietariosSelected(propietarios) {
            this.get('propietariosSeleccionados').push(propietarios);
Materialize.toast(propietarios.lenght, 5000, 'rounded transparent black-text');
Materialize.toast(propietarios, 5000, 'rounded transparent black-text');
			//this.set('propietariosSeleccionados', propietarios);
        }
    }
});