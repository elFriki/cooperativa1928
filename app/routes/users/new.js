import Ember from 'ember';
import Materialize from 'materialize';

const { toast } = Materialize;

export default Ember.Route.extend({

    firebaseApp: Ember.inject.service(),

    password: null,

    model() {
        return this.store.createRecord('user');
    },

    actions: {
        signIn(user) {
            toast('Comprobando...', 1000, 'rounded #ffca28 amber lighten-1 black-text');
            console.log(user);
            toast(user.get('displayName'), 5000, 'rounded #ffca28 amber lighten-1 black-text');
            const auth = this.get('firebaseApp').auth();
            console.log(user.get('email'));
            console.log(this.controller.get('password'));

            // AQUÍ EMPIEZA LA CREACIÓN DE USUARIO SI RESULTA CORREO DESCONOCIDO
            auth.createUserWithEmailAndPassword(
                user.get('email'),
                this.controller.get('password')).
            then((userResponse) => {
                    console.log(userResponse);
                    console.log(this.controller.get('model').get('displayName'));
                    const user = this.store.createRecord('user', {
                        id: userResponse.uid,
                        email: userResponse.email,
                        displayName: this.controller.get('model').get('displayName'),
                        phone: this.controller.get('model').get('phone'),
                        emailVerified: userResponse.emailVerified,
                        phoneVerified: false,
                        home: this.controller.get('model').get('home'),
                        photoURL: this.controller.get('model').get('photoURL'),
                        status: userResponse.status,
                        isAdmin: this.controller.get('model').get('isAdmin'),
                        isOwner: this.controller.get('model').get('isOwner'),
                        isActive: false
                    });
                    auth.currentUser.sendEmailVerification().then(function() {
                        toast("Se ha enviado un correo de confirmación.", 5000, 'rounded #ffca28 amber lighten-1 black-text');
                    });

                    this.get('session').open('firebase', {
                        provider: 'password',
                        email: this.get('email') || '',
                        password: this.get('password') || '',
                    }).then(() => {
                        this.controller.set('email', null);
                        this.controller.set('password', null);
                        this.controller.transitionTo('welcome');
                    }, (error) => {
                        toast(error, 5000, 'rounded #ffca28 amber lighten-1 black-text');
                    });
                    this.transitionTo('welcome');
                    auth.onAuthStateChanged(function(user) {
                        if (user.emailVerified) {
                            toast("El email está validado", 5000, 'rounded #ffca28 amber lighten-1 black-text');
                        } else {
                            toast("El email NO está validado", 5000, 'rounded #ffca28 amber lighten-1 black-text');
                        }
                    });
                    return user.save();
                }, (error) => {
                    if (error) {
                        toast(error.code, 5000, 'rounded #ffca28 amber lighten-1 black-text');
                        toast(error.message, 5000, 'rounded #ffca28 amber lighten-1 black-text');
                        this.controller.set('email', null);
                        this.controller.set('password', null);
                    }
                }

            );

            // AQUÍ ACABA LA CREACIÓN DE USUARIO SI RESULTA CORREO DESCONOCIDO

        },

        saveUser(user) {
            //console.log(user);
            Materialize.toast(user.get('displayName'), 5000, 'rounded transparent black-text');
            Materialize.toast(this.controller.get("displayName"), 5000, 'rounded transparent black-text');
            //            user.save().then(() => this.transitionTo('users'));
        },

        willTransition(transition) {

            let model = this.controller.get('model');

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