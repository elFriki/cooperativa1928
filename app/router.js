import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType,
    rootURL: config.rootURL
});

Router.map(function() {
    this.route('users', function() {
        this.route('new');
        this.route('edit', { path: '/:user_id/edit' });
    });
    this.route('propietarios', function() {
        this.route('new');
        this.route('edit', { path: '/:propietario_id/edit' });
    });
    this.route('inquilinos', function() {
        this.route('new');
        this.route('edit', { path: '/:inquilino_id/edit' });
    });
    this.route('calles', function() {
        this.route('new');
        this.route('edit', { path: '/:calle_id/edit' });
    });
    this.route('casas', function() {
        this.route('new');
        this.route('edit', { path: '/:casa_id/edit' });
    });
    this.route('sign-in');
    /*this.authenticatedRoute('welcome');*/

    this.route('index');
    this.route('info');
    this.route('wheel');
});

export default Router;