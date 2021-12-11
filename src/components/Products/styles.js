import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({ // Este hook de MUI permite generar hojas de estilo para las partes de un componente
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  root: {
    flexGrow: 1,
  },
}));