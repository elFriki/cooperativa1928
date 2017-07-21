import Ember from 'ember';

export default Ember.Route.extend({

    model() {
        return Ember.RSVP.hash({
            casas: this.store.findAll('casa').then(results => results.sortBy('calle').sortBy('numero')),
            calles: this.store.findAll('calle').then(results => results.sortBy('name')),
            propietarios: this.store.findAll('propietario').then(results => results.sortBy('name'))
        });
    },

    setupController(controller, model) {
        controller.set('casas', model.casas);
        controller.set('calles', model.calles);
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