const { Client } = require('@notionhq/client');

console.log("Notion Token: ", process.env.TU_TOKEN_DE_NOTION)
console.log("Notion Database ID: ", process.env.ID_DE_TU_BASE_DE_DATOS_EN_NOTION)

// Configura el cliente de Notion con tu token de integración
const notion = new Client({ auth: process.env.TU_TOKEN_DE_NOTION });

const patrones_tags = [
    {
        "vacaciones": ["vacaciones", "vacas"],
        "permiso": ["permiso", "permisos"],
        "BBSS": ["BBSS", "beneficios sociales"],
        "Finiquito": ["finiquito", "trunco", "truncas"],
        "Liquidacion": ["boletas", "lineas", "liquidacion", "liquidaciones"],
    }
]

// Función para agregar un nuevo caso borde a la base de datos de Notion
async function agregarCasoBorde(titulo, url, cuerpo, autor) {
    try {
        const tags = determinarTags(titulo, cuerpo);

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
                Tags: {
                    multi_select: tags.map(tag => ({ name: tag })),
                },
                Autor: {
                    rich_text: [
                        {
                            type: 'text',
                            text: {
                                content: autor,
                            },
                        },
                    ],
                },
            },
            children: [
                {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                        rich_text: [
                            {
                                type: 'text',
                                text: {
                                    content: cuerpo,
                                },
                            },
                        ],
                    },
                },
            ],
        });

        console.log('Caso borde agregado a Notion:', response.id);
    } catch (error) {
        console.error('Error al agregar caso borde a Notion:', error.body);
    }
}

function determinarTags(titulo, cuerpo) {
    const tagsEncontrados = [];

    patrones_tags.forEach((patron) => {
        for (const tag in patron) {
            const palabrasClave = patron[tag];
            const palabrasEnTitulo = palabrasClave.some(palabra => titulo.toLowerCase().includes(palabra));
            const palabrasEnCuerpo = palabrasClave.some(palabra => cuerpo.toLowerCase().includes(palabra));

            if (palabrasEnTitulo || palabrasEnCuerpo) {
                tagsEncontrados.push(tag);
            }
        }
    });

    return tagsEncontrados;
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
const autorPR = process.argv[6];
console.log('Autor del PR:', autorPR);

agregarCasoBorde(tituloPR, urlPR, cuerpoPR, autorPR);