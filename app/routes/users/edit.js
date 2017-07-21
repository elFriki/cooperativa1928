import Ember from 'ember';
import Materialize from 'materialize';

export default Ember.Route.extend({
    model(params) {
        return this.store.findRecord('user', params.user_id);
    },

    actions: {

        saveUser(myModel) {
            myModel.save().then((model) => {
                let msg = "Actualizado ";
                if ( model.name ) {
                    msg += model.name;
                }
Materialize.toast(msg, 2000, 'rounded #ffca28 amber lighten-1 black-text');
                this.transitionTo('users');
            }, (error) => {
                Materialize.toast(error, 5000, 'rounded #ffca28 amber lighten-1 black-text');
            });
        },

        willTransition(transition) {
            Materialize.toast("saliendo", 5000, 'rounded transparent black-text');

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