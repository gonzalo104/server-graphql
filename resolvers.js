const Curso    = require('./models/Curso');
const Profesor = require('./models/Profesor');


const resolvers = {
    Query:{
        cursos    : () => Curso.query().eager('[profesor, comentarios]'),
        profesores: () => Profesor.query().eager('cursos'),
        curso     : (rootValue, args) => Curso.query().eager('[profesor, comentarios]').findById(args.id),
        profesor  : (rootValue, args) => Profesor.query().eager('cursos').findById(args.id),

        buscar: (_, args) => {
            return [
                Profesor.query().findById(1),
                Curso.query().findById(1),
            ]
        }


    },
    ResultadoBusqueda:{
        __resolveType: (obj)=>{
            if (obj.nombre) return 'Profesor'
            return 'Curso'                            
        }
    },
  Mutation:{
    profesorAdd: (_, args) => {
        return Profesor.query().insert(args.profesor);
    },
    profesorEdit: (_,args)=>{
        return Profesor.query().patchAndFetchById(args.profesorId,args.profesor);
    },
    profesorDelete: (_,args)=>{
        return Profesor.query().findById(args.profesorId).then((profesor) => {
             return Profesor.query().deleteById(args.profesorId).then((filaBorradas)=> {
                 if (filaBorradas > 0) return profesor
                    throw new Error(`el profesor con id ${args.profesorId} no se pudo eliminar`);
             });
         })
    },
    cursoAdd   : (_, args) => Curso.query().insert(args.curso),
    cursoEdit  : (_, args) => Curso.query().patchAndFetchById(args.cursoId, args.curso),
    cursoDelete: (_, args) => Curso.query().findById(args.cursoId).then(curso => Curso.query().deleteById(args.cursoId).then(() => curso))
  }
}

module.exports = resolvers;