const { Client } = require('@notionhq/client');

// Configura el cliente de Notion con tu token de integración
const notion = new Client({ auth: process.env.TU_TOKEN_DE_NOTION });

// Función para agregar un nuevo caso borde a la base de datos de Notion
async function agregarCasoBorde(titulo, url, cuerpo) {
    try {
        const response = await notion.pages.create({
            parent: {
                database_id: process.env.ID_DE_TU_BASE_DE_DATOS_EN_NOTION,
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
console.log('Evento de GitHub:', eventoGitHub);
const tituloPR = process.argv[3];
console.log('Título del PR:', tituloPR);
const urlPR = process.argv[4];
console.log('URL del PR:', urlPR);
const cuerpoPR = process.argv[5];
console.log('Cuerpo del PR:', cuerpoPR);

agregarCasoBorde(tituloPR, urlPR, cuerpoPR);