# SenseSight

SenseSight/                              | Project Root

├──.venv/                               | Virtual Environment

├── backend/                             | FastAPI Backend Code

│   ├── app/    

│   │   ├── api/                       | Python Package for API

│   │   │   ├── _init_.py            |

│   │   │   ├── controllers/           | Handles endpoints (Python Package)

│   │   │   │   ├── _init_.py        |

│   │   │   │   ├── user_controller.py |

│   │   │   │   └── audio_controller.py| Handles audio endpoints

│   │   │   └── errors/                | Error Handling for HTTP requests (Python Package)

│   │   │       ├── _init_.py        |

│   │   │       └── http_exceptions.py |

│   │   ├── dao/                       | Data Access Object -> Database Interaction

│   │   │   ├── _init_.py            |

│   │   │   └── user_dao.py            |

│   │   ├── service/                   | Business Logic

│   │   │   ├── _init_.py            |

│   │   │   ├── user_service.py        |

│   │   │   └── audio_service.py       | Handles audio processing logic

│   │   ├── utils/                     | Utilities

│   │   │   ├── _init_.py            |

│   │   │   ├── auth_utils.py          |

│   │   │   └── audio_utils.py         | Utilities for audio processing

│   │   ├── vo/                        | Value Objects

│   │   │   ├── _init_.py            |

│   │   │   └── user_vo.py             |

│   │   ├── config.py                  | Configuration file for DB, API, etc.

│   │   └── main.py                    | FastAPI entry point (API Setup)

│   └── tests/                         | Test cases for backend

│       ├── _init_.py                |

│       ├── test_user.py               |

│       └── test_audio.py              |

├── frontend/                          | ReactJS Frontend Code

│   ├── public/                        | Static Files (HTML, CSS, JS, Images, etc.)

│   │   ├── static                     |

│   │   └── templates                  |

│   ├── src/                           | ReactJS Source Code

│   │   ├── components/                | Reusable UI Components

│   │   │   ├── header.js              |

│   │   │   ├── bookCard.js            |

│   │   │   └── audioPlayer.js         | Audio playback component

│   │   ├── app.js                     | Main ReactJS component

│   │   ├── index.js                   | React entry point

│   │   ├── services/                  | Frontend services (API calls)

│   │   │   └── audioService.js        | Handles audio-related API calls

│   │   └── package.json               | Frontend dependencies and scripts

├── migrations/                        | Database migration files

├── .gitignore                         | Git ignore file to exclude unnecessary files

├── README.md                          | Project Documentation

├── requirements.txt                   | Backend Dependencies

└── docker-compose.yaml                | Docker Compose for multi-container setup
