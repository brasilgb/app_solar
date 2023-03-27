import * as Yup from "yup";

import { ptForm } from "yup-locale-pt";
Yup.setLocale(ptForm);

export default Yup.object().shape({
    senha: Yup.string().required().min(6),
    repitaSenha: Yup
    .string()
    .required()
    .min(6)
    .oneOf([Yup.ref('senha')], 'Senhas devem ser iguais'),
});