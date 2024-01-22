import * as Yup from 'yup';

export const validationShemaForUsername = Yup.object().shape({
  username: Yup.string().required('Username is required'),
});

export const validationSchemaForRelays = Yup.object().shape({
  selectedRelays: Yup.array()
    .min(1, 'At least one relay must be selected')
    .required('At least one relay must be selected'),
});
