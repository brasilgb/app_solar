import * as Yup from "yup";

import { ptForm } from "yup-locale-pt";
Yup.setLocale(ptForm);

export default Yup.object().shape({
    celularCliente: Yup.string().min(11, 'Celular inválido').required("Por favor, informe o telefone"),
    emailCliente: Yup.string().email("E-mail inválido").required("Por favor, informe o e-mail"),
    senha: Yup.string().required("Por favor, informe uma senha").min(6),
    repitaSenha: Yup
    .string()
    .required("Por favor, repita a senha")
    .min(6)
    .oneOf([Yup.ref('senha')], 'Senhas devem ser iguais'),
});