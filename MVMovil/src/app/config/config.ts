// const URL_ROOT = 'https://carmsanc.pythonanywhere.com/api'
// const URL_ROOT_AUTH = 'https://carmsanc.pythonanywhere.com'

const URL_ROOT = 'http://192.168.0.101:8100/api'
const URL_ROOT_AUTH = 'http://192.168.0.101:8100'

const URL_SERVICIOS = {
    url_backend: URL_ROOT_AUTH,
    camposantos : URL_ROOT + '/camposantos/',
    camposanto : URL_ROOT + '/camposanto/',
    difunto : URL_ROOT + '/difunto/',
    difunto_post : URL_ROOT + '/difunto_post/',
    difuntos : URL_ROOT + '/difuntos/',
    red_social_post: URL_ROOT + '/red_social_post/',
    red_social_put: URL_ROOT + '/red_social_put/',
    red_social: URL_ROOT + '/redes_sociales_camp/',
    sector: URL_ROOT + '/sector_camp/',
    sepultura: URL_ROOT + '/tipo_sepultura_camp/',
    responsable_post: URL_ROOT + '/responsable_difunto_post/',
    responsable_get: URL_ROOT + '/responsable_difunto_get/',
    geolocalizacion_post: URL_ROOT + '/geolocalizacion_post/',
    empresas: URL_ROOT + '/empresas/',
    empresa_get: URL_ROOT + '/empresa_get/',
    token: URL_ROOT + '/token/',
    users: URL_ROOT_AUTH + '/users/',
    refresh_token: URL_ROOT + '/token/refresh/',
    fblogin: 'https://carmsanc.pythonanywhere.com/auth/convert-token/',
    obtener_usuarios: URL_ROOT + '/obtener_usuarios/',
    get_token_facebook: URL_ROOT + "/get_token_facebook/"
}

export default URL_SERVICIOS