import Ember from 'ember';
import Materialize from 'materialize';

const { toast } = Materialize;

export default Ember.Route.extend({

    beforeModel() {
        if (this.get('session.isAuthenticated')) {
            this.transitionTo('welcome');
        } else {
            toast('Este tipo de notas se mostrarán hasta que se hayan registrado más de la mitad de los propietarios.', 4000);
            toast('Si no se van solas...', 6000);
            toast('...échala a un lado...');
            toast('...para que desaparezca.', 10000);
        }
    },
    model() {
        return Ember.RSVP.hash({
            users: this.store.findAll('user').then(results => results.sortBy('email')),
            calles: this.store.findAll('calle').then(results => results.sortBy('name')),
            propietarios: this.store.findAll('propietario').then(results => results.sortBy('name')),
            inquilinos: this.store.findAll('inquilino').then(results => results.sortBy('name')),
            casas: this.store.findAll('casa').then(results => results.sortBy('calle'))
        });
    },

    setupController(controller, model) {
        controller.set('users', model.users);
        controller.set('calles', model.calles);
        controller.set('propietarios', model.propietarios);
        controller.set('inquilinos', model.inquilinos);
        controller.set('casas', model.casas);
    }

});
/*

Clemente Fernandez	3		José Alvarez Cuenca			
Clemente Fernandez	4		Concepción Esteban Cholan			
Clemente Fernandez	5		Yolanda Hernández  González			
Clemente Fernandez	7		Jose Antonio Toural Moreira			
Clemente Fernandez	8		Delia Martín Muñoz			
Clemente Fernandez	9		Gonzalo Palomo Rodriguez			
												Concepcion Martín			
Clemente Fernandez	10	Carmen Martínez Lope			
												Pedro Antonio Lopez Vera			
Clemente Fernandez	11	Félix Chamorro De Miguel			
Clemente Fernandez	12	Jesús Martín Sierra			
												Delia Muñoz Peña			
Clemente Fernandez	13	Ángel Luís Jiménez Sánchez			


Clemente Fernandez	14	Oscar Lobo			
Clemente Fernandez	15	Oswaldo Valcarcel De Las Heras			
Clemente Fernandez	16	Goya Echegaray			
Clemente Fernandez	17	Mª Rosario Lafont Mateo			
												Ángela Lafont Mateo			
Clemente Fernandez	18	Diana Rodriguez Monje			
Clemente Fernandez	19	Ángel Muñoz Peña			
Clemente Fernandez	20	Julio Egido González			
Clemente Fernandez	21	Fernando Moraleda Barba			
Clemente Fernandez	22	José González Martín			
Clemente Fernandez	23	Mª Jesus Gomez Hidalgo			
												Lorenzo Aparicio Coca			


Clemente Fernandez	24	Yolanda García Morales			
												Armando Nieto Díaz			
Clemente Fernandez	25	Teresa Rodriguez Sanchez			
Clemente Fernandez	26	Mª Jesus Gomez Hidalgo			
												Lorenzo Aparicio Coca			
Clemente Fernandez	27	Jose Carlos Muñoz Peña			
Clemente Fernandez	28	Fernando Boga González			
												Verónica Sanchez García			
Clemente Fernandez	29	Teresa Reguengo Daloma			
Clemente Fernandez	30	Antonio Ramirez Gomez			
Clemente Fernandez	32	Alfonso Fernández Hervás			
												Shanila Fernández Patel			
Clemente Fernandez	34	Elias Rodriguez Alonso			
Clemente Fernandez	36	Antonio Ramirez Gómez			


Clemente Fernandez	37	Daniel Muñoz Lopez			
												Mª Angeles Garcia Sanchez			
Clemente Fernandez	39	Valentín Carrasco González			
Clemente Fernandez	40	Carlos Francisco Sanchis Garcia			
Clemente Fernandez	41	Manuel Arias Molina			
												Mª Dolores Aranda Robledano			
Clemente Fernandez	42	Mª Luisa González Enrique			
Clemente Fernandez	43	Sabina Zuñiga Fernández			
Clemente Fernandez	44	Ignacio Flores Sanz			
												Mª Jesus Hernandez Martín			
Clemente Fernandez	45	Marina Vadillo Martín			
Clemente Fernandez	46	Mercedes Duran Machón			
Clemente Fernandez	47	Jesús Delgado González			
												Laia Portaceli			


Clemente Fernandez	48	David Rodriguez Sastre			
												Salomé López Galindo			
Clemente Fernandez	49	Carla Vigara De Castro			
												Fernando Javier Martínez-Conde Romero			
Clemente Fernandez	50	Propietario: Nieves Villar Vives			
												Inquilino: Marta - Fernando			
Clemente Fernandez	51	Agustín Delgado González			
												Violeta Alonso De Rojas			
Clemente Fernandez	52	Aurora Manchado Benayas			
Clemente Fernandez	53	Mº Cruz Fernández García			
Clemente Fernandez	55	Yolanda Bailo Medina			
												Carlos Gonzalez Fernández			
Clemente Fernandez	57	Miguel Angel Nogueira Martín			
Clemente Fernandez	58	Fco. Javier Tornero Esteban			
Clemente Fernandez	59	Carlos Calderon Garcia-Botey			


Clemente Fernandez	60	Mª Carmen Garcia Rodriguez			
												Enrique Glonzalez Garcia			
Clemente Fernandez	61	Concepción Garcia Botey			
Clemente Fernandez	62	Mª Carmen Gonzalez Redondo			
Clemente Fernandez	63	Paz Gómez Orejudo			
												Guillermo Soler Gomez			
Clemente Fernandez	64	Antono Angel Rodriguez Saez			
												Soledad Lucia Ruiz Sanchez			
Clemente Fernandez	65	Ángela Guillen García			
Clemente Fernandez	66	Josefa Dueñas			
Clemente Fernandez	67	Propietario: Pedro López Camas			
												Inquilino: Rubén Fernández Arenas			
Clemente Fernandez	68	Mª Del Carmen Palacios De La Plaza			
Clemente Fernandez	69	Marlene Mourreau 			


Clemente Fernandez	73	Gonzalo Gil Zabala			
Clemente Fernandez	75	Aldasoro Romera Calvo			
Clemente Fernandez	77	Manuel Barriga Cano			
												Ana Izabel Barriga			
Antonio Gisau	1	Marcela Alejandra			
								Amoedo Farias			
Antonio Gisau	3	Isabel Guix Alonso			
								Miguel Ojeda Merin			
Antonio Gisau	5	Mª Pilar Alonso Calzada			
								Francisco Muñoz Bernal			
Antonio Gisau	7	Pepe			
Pso. de los Olivos	40	Francisco Muñoz Bernal			
Pso. de los Olivos	42	Mª. Dolores Ruiz Ibarra 			
												Mª Pilar Ruiz Ibarra			
Pso. de los Olivos	44	Jesús Santín Digón			
												Paloma Hortigüela Ayuso			


Pso. de los Olivos	46	Isabel Santín Hortigüela			
												Enrique Toledano Moreno			
Pso. de los Olivos	48				
Rogelio Osorio	4	Juan Suero Borrego			
Rogelio Osorio	6	Jose Manuel Marcos Rubio			
									Pilar Preciado			
Rogelio Osorio	8	Mª Lourdes De Pablo Oteo			
									Juan Pedro Schwartz Guerrero			
Rogelio Osorio	10	Jonas Fredrik Almen			
Pso. de Extremadura	143	Eduardo Sánchez Cantos			
		Encarnación Sánchez Cantos			
*/