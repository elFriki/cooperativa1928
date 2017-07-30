import Ember from 'ember';
import Materialize from 'materialize';

const { toast } = Materialize;

export default Ember.Route.extend({

    model(params) {
        return this.store.findRecord('user', params.user_id);
    },

    actions: {

        willTransition(transition) {
            toast("saliendo", 5000, 'rounded transparent black-text');

            let model = this.controller.get('model');
            //Materialize.toast(model.get('hasDirtyAttributes'), 5000, 'rounded transparent black-text');

            if (model.get('hasDirtyAttributes')) {
                let confirmation = confirm("No se ha guardao. ¿Quieres salir de aquí?");

                if (confirmation) {
                    model.rollbackAttributes();
                } else {
                    transition.abort();
                }
            }
        }
    }
});