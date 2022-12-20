export enum LmsUrl {
  GRAPHQL = 'http://127.0.0.1:1337',
}

export enum MethodHttp {
  POST = 'POST',
  GET = 'GET',
}

export enum EventModel {
  COURSE = 'course',
  COURSE_BLOCK = 'course-block',
  COURSE_DESCRIPTION = 'course-description',
  CONTENT = 'content',
  EPISODE = 'episode',
  EPISODE_CONTENT = 'episode-content',
}

export enum EventType {
  UPDATE = 'entry.update',
}

export enum GraphQlQuery {
  ALL_COURSES = `
          query Course {
            course(id: courseId) {
              data {
                id
                attributes {
                  serial_number
                  human_readable_id
                  image {
                    data {
                      id
                      attributes {
                        url
                        size
                        name
                        ext
                        hash
                      }
                    }
                  }
                  episodes {
                    data {
                    id
                      attributes {
                        episode_number
                        human_readable_id
                        episode_contents {
                          data {
                            id
                            attributes {
                              title
                              learning_outcome
                              language
                              notes {
                                data {
                                  id
                                  attributes {
                                    human_readable_id
                                    file {
                                      data {
                                        id
                                        attributes {
                                        url
                                        size
                                        name
                                        ext
                                        hash
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              image {
                                data {
                                  id
                                  attributes {
                                  url
                                  size
                                  name
                                  ext
                                  hash
                                  }
                                }
                              }
                              activity {
                                data {
                                  id
                                  attributes {
                                  url
                                  size
                                  name
                                  ext
                                  hash
                                  }
                                }
                              }
                              episode_guide {
                                data {
                                  id
                                  attributes {
                                  url
                                  size
                                  name
                                  ext
                                  hash
                                  }
                                }
                              }
                              homework {
                                data {
                                  id
                                  attributes {
                                  url
                                  size
                                  name
                                  ext
                                  hash
                                  }
                                }
                              }
                              homework_guide {
                                data {
                                  id
                                  attributes {
                                  url
                                  size
                                  name
                                  ext
                                  hash
                                  }
                                }
                              }
                              worksheet {
                                data {
                                  id
                                  attributes {
                                  url
                                  size
                                  name
                                  ext
                                  hash
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  course_contents {
                    data {
                      id
                      attributes {
                        language
                        course_summary_items {
                          data {
                            id
                            attributes {
                              title
                              card_name
                              body
                              serial_number
                            }
                          }
                        }
                        course_description {
                          data {
                            id
                            attributes {
                              title
                              short_description
                              description
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }`,
}
