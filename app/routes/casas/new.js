import Ember from 'ember';
import Materialize from 'materialize';

export default Ember.Route.extend({

    model() {
        return Ember.RSVP.hash({
            casa: this.store.createRecord('casa'),
            calles: this.store.findAll('calle').then(results => results.sortBy('name')),
            propietarios: this.store.findAll('propietario').then(results => results.sortBy('name'))
        });
    },

    setupController(controller, model) {
        controller.set('casa', model.casa);
        controller.set('calles', model.calles);
        controller.set('propietarios', model.propietarios);
    },

    actions: {
        saveModel(myModel) {
            console.log(myModel);
            Materialize.toast(this.controller.get('casa'));
            let calle = this.controller.get('calleSeleccionada');
            //let actualCalle = this.store.findRecord('calle', calle).then(() => Materialize.toast(actualCalle.get('name')));
            Materialize.toast(this.controller.get('casa'));
            this.controller.get('casa').set('calle', calle);
            Materialize.toast(this.controller.get('casa.numero'));
            Materialize.toast(this.controller.get('casa.calle'));
            Materialize.toast(calle);
            //Materialize.toast(this.controller.get('propietariosSeleccionados'), 5000, 'rounded');
            //myModel.set('calle', calle);
            //            myModel.set('propietarios', this.controller.get('propietariosSeleccionados'));
            if (this.controller.get('casa').get('calle')) {
                Materialize.toast(myModel.get('calle'));
                this.controller.get('casa').get('calle').then((result) => console.log("la calle " + result.get('calle')));
                //myModel.save().then(() => this.transitionTo('casas')).error((error) => Materialize(error));
            } else {
                Materialize.toast("calle vacía");
            }
        },

        willTransition(transition) {

            let model = this.controller.get('casa');

            if (model.get('hasDirtyAttributes')) {
                let confirmation = confirm("No se ha guardao. ¿Quieres salir de aquí?");

                if (confirmation) {
                    Materialize.toast("Aplicando cambios...", 2000, 'rounded transparent black-text');
                    model.rollbackAttributes();
                } else {
                    Materialize.toast("Cancelando...", 1000, 'rounded transparent black-text');
                    transition.abort();
                }
            }
        }
    }
});