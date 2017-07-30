import DS from 'ember-data';

export default DS.Model.extend({
    displayName: DS.attr('string'),
    email: DS.attr('string'),
    phone: DS.attr('string'),
    emailVerified: DS.attr('boolean'),
    phoneVerified: DS.attr('boolean'),
    status: DS.attr('string'),
    home: DS.belongsTo('casa'),
    isAdmin: DS.attr('boolean'),
    isOwner: DS.attr('boolean'),
    isRenter: DS.attr('boolean'),
    isGuest: DS.attr('boolean'),
    isActive: DS.attr('boolean')
});