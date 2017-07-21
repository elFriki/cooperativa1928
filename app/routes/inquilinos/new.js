import Ember from 'ember';
import Materialize from 'materialize';

export default Ember.Route.extend({

    model() {
        return this.store.createRecord('inquilino');
    },

    actions: {
        saveModel(myModel) {
            myModel.save().then(() => this.transitionTo('inquilinos'));
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