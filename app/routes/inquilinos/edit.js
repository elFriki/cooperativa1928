import Ember from 'ember';
import Materialize from 'materialize';

export default Ember.Route.extend({
    model(params) {
        return this.store.findRecord('inquilino', params.inquilino_id);
    },

    actions: {
        saveModel(myModel) {
            myModel.save().then((model) => {
                let msg = "Actualizado ";
                if ( model.name ) {
                    msg += model.name;
                }
Materialize.toast(msg, 2000, 'rounded #ffca28 amber lighten-1 black-text');
                this.transitionTo('inquilinos');
            }, (error) => {
                Materialize.toast(error, 5000, 'rounded #ffca28 amber lighten-1 black-text');
            });
        },

        willTransition(transition) {

            let model = this.controller.get('model');

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