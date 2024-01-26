const { Client } = require('@notionhq/client');

// Configura el cliente de Notion con tu token de integración
const notion = new Client({ auth: 'TU_TOKEN_DE_NOTION' });

// Función para agregar un nuevo caso borde a la base de datos de Notion
async function agregarCasoBorde(titulo, url, cuerpo) {
    try {
        const response = await notion.pages.create({
            parent: {
                database_id: 'ID_DE_TU_BASE_DE_DATOS_EN_NOTION',
            },
            properties: {
                Titulo: {
                    title: [
                        {
                            text: {
                                content: titulo,
                            },
                        },
                    ],
                },
                URL: {
                    url: url,
                },
                Cuerpo: {
                    rich_text: [
                        {
                            text: {
                                content: cuerpo,
                            },
                        },
                    ],
                },
            },
        });

        console.log('Caso borde agregado a Notion:', response.id);
    } catch (error) {
        console.error('Error al agregar caso borde a Notion:', error.body);
    }
}

// Obtén datos del evento de GitHub
const eventoGitHub = process.argv[2];
const tituloPR = process.argv[3];
const urlPR = process.argv[4];
const cuerpoPR = process.argv[5];

// Verifica si el evento es un PR etiquetado
if (eventoGitHub === 'labeled' && tituloPR && urlPR && cuerpoPR) {
    // Agrega el caso borde a Notion
    agregarCasoBorde(tituloPR, urlPR, cuerpoPR);
}
