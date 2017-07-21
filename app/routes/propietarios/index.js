import Ember from 'ember';

export default Ember.Route.extend({

    model() {
        return Ember.RSVP.hash({
            propietarios: this.store.findAll('propietario').then(results => results.sortBy('name')),
        });
    },

    setupController(controller, model) {
        controller.set('propietarios', model.propietarios);
    },

    actions: {

        deleteModel(myModel) {
            let literal = '¿Seguro?';
            let confirmation = confirm(literal);

            if (confirmation) {
                myModel.destroyRecord().then(() => this.transitionTo('index'));
            }
        }
    }

});