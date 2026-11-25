{
  "openapi": "3.0.0",
  "info": {
    "title": "Travel Plan API",
    "version": "1.0.0",
    "description": "API cho website du lịch"
  },
  "servers": [
    {
      "url": "/api",
      "description": "Current Server"
    },
    {
      "url": "http://localhost:5000/api",
      "description": "Local Development Server"
    }
  ],
  "components": {
    "securitySchemes": {
      "cookieAuth": {
        "type": "apiKey",
        "in": "cookie",
        "name": "jwt"
      },
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    },
    "schemas": {
      "Trip": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "user": {
            "type": "string",
            "description": "ID của User sở hữu chuyến đi"
          },
          "title": {
            "type": "string",
            "description": "Tên chuyến đi"
          },
          "city": {
            "type": "string",
            "description": "ID thành phố điểm đến"
          },
          "startDate": {
            "type": "string",
            "format": "date"
          },
          "endDate": {
            "type": "string",
            "format": "date"
          },
          "budget": {
            "type": "number"
          },
          "schedule": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "day": {
                  "type": "integer"
                },
                "date": {
                  "type": "string",
                  "format": "date-time"
                },
                "places": {
                  "type": "array",
                  "items": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "diary": {
            "type": "object",
            "properties": {
              "notes": {
                "type": "string"
              },
              "photos": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          }
        }
      },
      "Review": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "user": {
            "type": "string",
            "description": "ID của User viết review"
          },
          "itemType": {
            "type": "string",
            "enum": [
              "Attraction",
              "Hotel",
              "Restaurant",
              "Cafe"
            ]
          },
          "itemId": {
            "type": "string",
            "description": "ID của địa điểm"
          },
          "rating": {
            "type": "number",
            "minimum": 1,
            "maximum": 5
          },
          "comment": {
            "type": "string"
          }
        },
        "example": {
          "_id": "60d0fe4f5311236168a109cb",
          "user": "60d0fe4f5311236168a109ca",
          "itemType": "Hotel",
          "itemId": "60d0fe4f5311236168a109c9",
          "rating": 5,
          "comment": "Khách sạn rất đẹp, phục vụ chu đáo!"
        }
      },
      "Attraction": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "images": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "admissionFee": {
            "type": "number"
          },
          "address": {
            "type": "string"
          },
          "coordinates": {
            "type": "object",
            "properties": {
              "lat": {
                "type": "number"
              },
              "lng": {
                "type": "number"
              }
            }
          },
          "rating": {
            "type": "number"
          },
          "numReviews": {
            "type": "number"
          }
        }
      },
      "Hotel": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "images": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "stars": {
            "type": "number"
          },
          "pricePerNight": {
            "type": "number"
          },
          "address": {
            "type": "string"
          },
          "coordinates": {
            "type": "object",
            "properties": {
              "lat": {
                "type": "number"
              },
              "lng": {
                "type": "number"
              }
            }
          },
          "rating": {
            "type": "number"
          },
          "numReviews": {
            "type": "number"
          }
        }
      },
      "Restaurant": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "images": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "cuisineType": {
            "type": "string"
          },
          "price": {
            "type": "number"
          },
          "address": {
            "type": "string"
          },
          "coordinates": {
            "type": "object",
            "properties": {
              "lat": {
                "type": "number"
              },
              "lng": {
                "type": "number"
              }
            }
          },
          "rating": {
            "type": "number"
          },
          "numReviews": {
            "type": "number"
          }
        }
      },
      "Cafe": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "images": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "price": {
            "type": "number"
          },
          "address": {
            "type": "string"
          },
          "coordinates": {
            "type": "object",
            "properties": {
              "lat": {
                "type": "number"
              },
              "lng": {
                "type": "number"
              }
            }
          },
          "rating": {
            "type": "number"
          },
          "numReviews": {
            "type": "number"
          }
        }
      },
      "Favorite": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "user": {
            "type": "string",
            "description": "ID của User sở hữu"
          },
          "itemType": {
            "type": "string",
            "enum": [
              "Attraction",
              "Hotel",
              "Restaurant",
              "Cafe"
            ]
          },
          "itemId": {
            "type": "object",
            "description": "Thông tin địa điểm được populate chi tiết"
          }
        },
        "example": {
          "_id": "60d0fe4f5311236168a109cd",
          "user": "60d0fe4f5311236168a109ca",
          "itemType": "Hotel",
          "itemId": {
            "_id": "60d0fe4f5311236168a109c9",
            "name": "Khách sạn Mường Thanh",
            "address": "Đà Nẵng",
            "city": {
              "_id": "60d0fe4f5311236168a109ca",
              "name": "Đà Nẵng"
            }
          }
        }
      },
      "City": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string",
            "description": "ID tự động sinh của thành phố"
          },
          "name": {
            "type": "string",
            "description": "Tên thành phố"
          },
          "description": {
            "type": "string",
            "description": "Mô tả về thành phố"
          },
          "image": {
            "type": "string",
            "description": "URL ảnh phong cảnh thành phố"
          },
          "coordinates": {
            "type": "object",
            "properties": {
              "lat": {
                "type": "number",
                "description": "Vĩ độ"
              },
              "lng": {
                "type": "number",
                "description": "Kinh độ"
              }
            }
          }
        },
        "example": {
          "_id": "60d0fe4f5311236168a109ca",
          "name": "Đà Nẵng",
          "description": "Thành phố đáng sống nhất Việt Nam với nhiều bãi biển đẹp.",
          "image": "https://example.com/danang.jpg",
          "coordinates": {
            "lat": 16.0544,
            "lng": 108.2022
          }
        },
        "allOf": [
          {
            "type": "object",
            "properties": {
              "_id": {
                "type": "string",
                "description": "ID tự sinh từ MongoDB"
              }
            }
          },
          {
            "$ref": "#/components/schemas/CityInput"
          }
        ]
      },
      "User": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string",
            "description": "ID tự động của User"
          },
          "name": {
            "type": "string",
            "description": "Tên người dùng"
          },
          "email": {
            "type": "string",
            "description": "Địa chỉ email của người dùng"
          },
          "avatar": {
            "type": "string",
            "description": "URL ảnh đại diện"
          },
          "phone": {
            "type": "string",
            "description": "Số điện thoại"
          },
          "gender": {
            "type": "string",
            "description": "Giới tính"
          },
          "dateOfBirth": {
            "type": "string",
            "format": "date",
            "description": "Ngày sinh"
          },
          "travelPreferences": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Sở thích du lịch"
          },
          "favoriteBudget": {
            "type": "string",
            "description": "Ngân sách ưa thích"
          },
          "isAdmin": {
            "type": "boolean",
            "description": "Quyền Admin (true/false)"
          }
        },
        "example": {
          "_id": "60d0fe4f5311236168a109ca",
          "name": "John Doe",
          "email": "john@example.com",
          "avatar": "",
          "phone": "0987654321",
          "gender": "Nam",
          "dateOfBirth": "2004-01-01",
          "travelPreferences": [
            "Biển",
            "Cafe",
            "Ẩm thực"
          ],
          "favoriteBudget": "Trung bình",
          "isAdmin": false
        }
      },
      "Coordinates": {
        "type": "object",
        "properties": {
          "lat": {
            "type": "number"
          },
          "lng": {
            "type": "number"
          }
        },
        "example": {
          "lat": 21.0285,
          "lng": 105.8542
        }
      },
      "AttractionInput": {
        "type": "object",
        "required": [
          "name",
          "city",
          "description",
          "admissionFee",
          "address"
        ],
        "properties": {
          "name": {
            "type": "string"
          },
          "city": {
            "type": "string",
            "description": "ID của City"
          },
          "description": {
            "type": "string"
          },
          "images": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "admissionFee": {
            "type": "number"
          },
          "address": {
            "type": "string"
          },
          "coordinates": {
            "$ref": "#/components/schemas/Coordinates"
          }
        },
        "example": {
          "name": "Lăng Bác",
          "city": "60d0fe4f5311236168a109ca",
          "description": "Lăng Chủ tịch Hồ Chí Minh.",
          "images": [
            "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375"
          ],
          "admissionFee": 0,
          "address": "Hùng Vương, Điện Biên, Ba Đình, Hà Nội",
          "coordinates": {
            "lat": 21.0368,
            "lng": 105.8346
          }
        }
      },
      "HotelInput": {
        "type": "object",
        "required": [
          "name",
          "city",
          "description",
          "stars",
          "pricePerNight",
          "address"
        ],
        "properties": {
          "name": {
            "type": "string"
          },
          "city": {
            "type": "string",
            "description": "ID của City"
          },
          "description": {
            "type": "string"
          },
          "images": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "stars": {
            "type": "number",
            "minimum": 1,
            "maximum": 5
          },
          "pricePerNight": {
            "type": "number"
          },
          "address": {
            "type": "string"
          },
          "coordinates": {
            "$ref": "#/components/schemas/Coordinates"
          }
        },
        "example": {
          "name": "Melia Hanoi",
          "city": "60d0fe4f5311236168a109ca",
          "description": "Khách sạn 5 sao.",
          "images": [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945"
          ],
          "stars": 5,
          "pricePerNight": 2500000,
          "address": "44 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội",
          "coordinates": {
            "lat": 21.0253,
            "lng": 105.8491
          }
        }
      },
      "RestaurantInput": {
        "type": "object",
        "required": [
          "name",
          "city",
          "description",
          "cuisineType",
          "price",
          "address"
        ],
        "properties": {
          "name": {
            "type": "string"
          },
          "city": {
            "type": "string",
            "description": "ID của City"
          },
          "description": {
            "type": "string"
          },
          "images": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "cuisineType": {
            "type": "string"
          },
          "price": {
            "type": "number"
          },
          "address": {
            "type": "string"
          },
          "coordinates": {
            "$ref": "#/components/schemas/Coordinates"
          }
        },
        "example": {
          "name": "Phở Thìn Bờ Hồ",
          "city": "60d0fe4f5311236168a109ca",
          "description": "Phở gia truyền lâu đời.",
          "images": [
            "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43"
          ],
          "cuisineType": "Ẩm thực Việt Nam",
          "price": 50000,
          "address": "61 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội",
          "coordinates": {
            "lat": 21.0298,
            "lng": 105.8524
          }
        }
      },
      "CafeInput": {
        "type": "object",
        "required": [
          "name",
          "city",
          "description",
          "price",
          "address"
        ],
        "properties": {
          "name": {
            "type": "string"
          },
          "city": {
            "type": "string",
            "description": "ID của City"
          },
          "description": {
            "type": "string"
          },
          "images": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "price": {
            "type": "number"
          },
          "address": {
            "type": "string"
          },
          "coordinates": {
            "$ref": "#/components/schemas/Coordinates"
          }
        },
        "example": {
          "name": "Cộng Cà Phê",
          "city": "60d0fe4f5311236168a109ca",
          "description": "Không gian thời bao cấp.",
          "images": [
            "https://images.unsplash.com/photo-1554118811-1e0d58224f24"
          ],
          "price": 45000,
          "address": "27 Nhà Thờ, Hoàn Kiếm, Hà Nội",
          "coordinates": {
            "lat": 21.0287,
            "lng": 105.8489
          }
        }
      },
      "CityInput": {
        "type": "object",
        "required": [
          "name",
          "description",
          "image"
        ],
        "properties": {
          "name": {
            "type": "string",
            "description": "Tên thành phố"
          },
          "description": {
            "type": "string",
            "description": "Mô tả về thành phố"
          },
          "image": {
            "type": "string",
            "description": "URL ảnh thành phố"
          },
          "coordinates": {
            "type": "object",
            "properties": {
              "lat": {
                "type": "number"
              },
              "lng": {
                "type": "number"
              }
            }
          }
        },
        "example": {
          "name": "Hà Nội",
          "description": "Thủ đô ngàn năm văn hiến.",
          "image": "https://images.unsplash.com/photo-1509062522246-3755977927d7",
          "coordinates": {
            "lat": 21.0285,
            "lng": 105.8542
          }
        }
      }
    }
  },
  "paths": {
    "/upload": {
      "post": {
        "summary": "Tải ảnh lên (cục bộ hoặc Cloudinary)",
        "tags": [
          "Upload"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "required": [
                  "image"
                ],
                "properties": {
                  "image": {
                    "type": "string",
                    "format": "binary",
                    "description": "File ảnh cần tải lên"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Tải ảnh lên thành công",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Image uploaded to Cloudinary successfully"
                    },
                    "url": {
                      "type": "string",
                      "example": "https://res.cloudinary.com/...image.jpg"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Chưa chọn file tải lên"
          },
          "401": {
            "description": "Chưa xác thực"
          },
          "500": {
            "description": "Lỗi hệ thống khi tải ảnh"
          }
        }
      }
    },
    "/trips": {
      "post": {
        "summary": "Tạo chuyến đi mới (Tự động sinh schedule ngày)",
        "tags": [
          "Trips"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "title",
                  "city",
                  "startDate",
                  "endDate"
                ],
                "properties": {
                  "title": {
                    "type": "string"
                  },
                  "city": {
                    "type": "string",
                    "description": "ID của City"
                  },
                  "startDate": {
                    "type": "string",
                    "format": "date",
                    "example": "2026-07-20"
                  },
                  "endDate": {
                    "type": "string",
                    "format": "date",
                    "example": "2026-07-22"
                  },
                  "budget": {
                    "type": "number"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Tạo chuyến đi thành công"
          },
          "400": {
            "description": "Dữ liệu không hợp lệ"
          },
          "401": {
            "description": "Chưa đăng nhập"
          }
        }
      },
      "get": {
        "summary": "Lấy danh sách chuyến đi của tôi (Phân nhóm: Sắp tới, Đang đi, Lịch sử)",
        "tags": [
          "Trips"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Thành công",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "upcoming": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Trip"
                      }
                    },
                    "ongoing": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Trip"
                      }
                    },
                    "past": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Trip"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/trips/{id}": {
      "get": {
        "summary": "Xem chi tiết lịch trình chuyến đi (Populate địa điểm)",
        "tags": [
          "Trips"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Thành công"
          },
          "401": {
            "description": "Chưa đăng nhập hoặc không có quyền"
          },
          "404": {
            "description": "Không tìm thấy chuyến đi"
          }
        }
      },
      "delete": {
        "summary": "Xóa chuyến đi",
        "tags": [
          "Trips"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Xóa thành công"
          },
          "401": {
            "description": "Chưa đăng nhập hoặc không có quyền"
          },
          "404": {
            "description": "Không tìm thấy chuyến đi"
          }
        }
      }
    },
    "/trips/{id}/schedule/places": {
      "post": {
        "summary": "Thêm địa điểm vào lịch trình ngày của chuyến đi (Yêu cầu Đăng nhập)",
        "tags": [
          "Trips - Itinerary"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID chuyến đi"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "day",
                  "placeType",
                  "placeId"
                ],
                "properties": {
                  "day": {
                    "type": "integer",
                    "description": "Số thứ tự ngày (Ví dụ 1, 2, 3...)"
                  },
                  "placeType": {
                    "type": "string",
                    "enum": [
                      "Attraction",
                      "Hotel",
                      "Restaurant",
                      "Cafe"
                    ]
                  },
                  "placeId": {
                    "type": "string"
                  },
                  "note": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Thêm thành công"
          },
          "400": {
            "description": "Thông tin không hợp lệ hoặc ngày không tồn tại"
          },
          "401": {
            "description": "Chưa đăng nhập hoặc không có quyền"
          }
        }
      }
    },
    "/trips/{id}/schedule/reorder": {
      "put": {
        "summary": "Sắp xếp lại thứ tự điểm đi trong ngày (Yêu cầu Đăng nhập)",
        "tags": [
          "Trips - Itinerary"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID chuyến đi"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "day",
                  "placesOrder"
                ],
                "properties": {
                  "day": {
                    "type": "integer"
                  },
                  "placesOrder": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "Mảng chứa các ID phụ (places._id) theo thứ tự mới"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Sắp xếp thành công"
          },
          "400": {
            "description": "Lỗi đầu vào"
          }
        }
      }
    },
    "/trips/{id}/schedule/places/{subId}": {
      "delete": {
        "summary": "Xóa địa điểm khỏi lịch trình ngày (Yêu cầu Đăng nhập)",
        "tags": [
          "Trips - Itinerary"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID chuyến đi"
          },
          {
            "in": "path",
            "name": "subId",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID phụ của địa điểm trong schedule (places._id)"
          }
        ],
        "responses": {
          "200": {
            "description": "Xóa thành công"
          }
        }
      }
    },
    "/trips/{id}/schedule/places/{subId}/check-in": {
      "patch": {
        "summary": "Đánh dấu đã tham quan / Check-in địa điểm (Dành riêng cho Mobile App)",
        "description": "Endpoint này phục vụ chính cho tính năng Check-in thực tế trên Mobile App dựa trên GPS hoặc hành động của người dùng tại địa điểm.",
        "tags": [
          "Trips - Itinerary"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID chuyến đi"
          },
          {
            "in": "path",
            "name": "subId",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID phụ của địa điểm (places._id) trong lịch trình"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "visited"
                ],
                "properties": {
                  "visited": {
                    "type": "boolean",
                    "description": "Trạng thái check-in (true: đã đi, false: chưa đi)"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Cập nhật check-in thành công, trả về chi tiết chuyến đi"
          },
          "400": {
            "description": "Thiếu trường dữ liệu visited"
          },
          "401": {
            "description": "Chưa đăng nhập hoặc không có quyền"
          }
        }
      }
    },
    "/trips/{id}/diary": {
      "put": {
        "summary": "Cập nhật Nhật ký chuyến đi & Hình ảnh tải lên (Dùng cho cả Web và Mobile)",
        "description": "Người dùng viết chia sẻ trải nghiệm (diary notes) và đính kèm danh sách ảnh (url) sau chuyến đi.",
        "tags": [
          "Trips - Itinerary"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID chuyến đi"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "notes": {
                    "type": "string",
                    "description": "Ghi chú nhật ký trải nghiệm"
                  },
                  "photos": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "Mảng chứa các link ảnh du lịch (tải lên thông qua CDN / Cloudinary)"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Cập nhật nhật ký thành công"
          },
          "401": {
            "description": "Chưa đăng nhập hoặc không có quyền"
          }
        }
      }
    },
    "/reviews/{itemType}/{itemId}": {
      "get": {
        "summary": "Lấy danh sách đánh giá của một địa điểm cụ thể",
        "tags": [
          "Reviews"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "itemType",
            "required": true,
            "schema": {
              "type": "string",
              "enum": [
                "Attraction",
                "Hotel",
                "Restaurant",
                "Cafe"
              ]
            },
            "description": "Loại địa điểm"
          },
          {
            "in": "path",
            "name": "itemId",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID của địa điểm"
          }
        ],
        "responses": {
          "200": {
            "description": "Thành công",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "total": {
                      "type": "integer"
                    },
                    "reviews": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Review"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/reviews": {
      "post": {
        "summary": "Viết đánh giá mới cho địa điểm (Yêu cầu Đăng nhập)",
        "tags": [
          "Reviews"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "itemType",
                  "itemId",
                  "rating",
                  "comment"
                ],
                "properties": {
                  "itemType": {
                    "type": "string",
                    "enum": [
                      "Attraction",
                      "Hotel",
                      "Restaurant",
                      "Cafe"
                    ]
                  },
                  "itemId": {
                    "type": "string"
                  },
                  "rating": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 5
                  },
                  "comment": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Viết đánh giá thành công"
          },
          "400": {
            "description": "Thiếu thông tin hoặc đã đánh giá trước đó"
          },
          "401": {
            "description": "Chưa đăng nhập"
          }
        }
      }
    },
    "/reviews/{id}": {
      "delete": {
        "summary": "Xóa đánh giá của chính mình (Yêu cầu Đăng nhập)",
        "tags": [
          "Reviews"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID của đánh giá cần xóa"
          }
        ],
        "responses": {
          "200": {
            "description": "Xóa thành công"
          },
          "401": {
            "description": "Không có quyền xóa"
          },
          "404": {
            "description": "Không tìm thấy đánh giá"
          }
        }
      }
    },
    "/places/search": {
      "get": {
        "summary": "Tìm kiếm tổng hợp trên tất cả loại địa điểm (Global Search)",
        "tags": [
          "Places"
        ],
        "parameters": [
          {
            "in": "query",
            "name": "q",
            "schema": {
              "type": "string"
            },
            "description": "Từ khóa tìm kiếm theo tên địa điểm"
          },
          {
            "in": "query",
            "name": "city",
            "schema": {
              "type": "string"
            },
            "description": "Lọc theo ID thành phố"
          }
        ],
        "responses": {
          "200": {
            "description": "Thành công",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "attractions": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Attraction"
                      }
                    },
                    "hotels": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Hotel"
                      }
                    },
                    "restaurants": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Restaurant"
                      }
                    },
                    "cafes": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Cafe"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/places/{type}": {
      "get": {
        "summary": "Lấy danh sách địa điểm theo phân loại (attraction, hotel, restaurant, cafe) kèm bộ lọc",
        "tags": [
          "Places"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "type",
            "required": true,
            "schema": {
              "type": "string",
              "enum": [
                "attraction",
                "hotel",
                "restaurant",
                "cafe"
              ]
            },
            "description": "Loại địa điểm cần lấy"
          },
          {
            "in": "query",
            "name": "city",
            "schema": {
              "type": "string"
            },
            "description": "Lọc theo ID thành phố"
          },
          {
            "in": "query",
            "name": "search",
            "schema": {
              "type": "string"
            },
            "description": "Tìm kiếm tên địa điểm"
          },
          {
            "in": "query",
            "name": "stars",
            "schema": {
              "type": "integer"
            },
            "description": "Lọc theo số sao (chỉ cho hotel)"
          },
          {
            "in": "query",
            "name": "minPrice",
            "schema": {
              "type": "number"
            },
            "description": "Giá thấp nhất (chỉ cho hotel)"
          },
          {
            "in": "query",
            "name": "maxPrice",
            "schema": {
              "type": "number"
            },
            "description": "Giá cao nhất (chỉ cho hotel)"
          },
          {
            "in": "query",
            "name": "minFee",
            "schema": {
              "type": "number"
            },
            "description": "Phí vào cửa thấp nhất (chỉ cho attraction)"
          },
          {
            "in": "query",
            "name": "maxFee",
            "schema": {
              "type": "number"
            },
            "description": "Phí vào cửa cao nhất (chỉ cho attraction)"
          },
          {
            "in": "query",
            "name": "cuisineType",
            "schema": {
              "type": "string"
            },
            "description": "Loại ẩm thực (chỉ cho restaurant)"
          },
          {
            "in": "query",
            "name": "minPrice",
            "schema": {
              "type": "number"
            },
            "description": "Giá thấp nhất (cho restaurant, cafe)"
          },
          {
            "in": "query",
            "name": "maxPrice",
            "schema": {
              "type": "number"
            },
            "description": "Giá cao nhất (cho restaurant, cafe)"
          }
        ],
        "responses": {
          "200": {
            "description": "Lấy danh sách thành công",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "total": {
                      "type": "integer"
                    },
                    "places": {
                      "type": "array",
                      "items": {
                        "type": "object"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/places/{type}/{id}": {
      "get": {
        "summary": "Xem thông tin chi tiết một địa điểm theo loại và ID",
        "tags": [
          "Places"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "type",
            "required": true,
            "schema": {
              "type": "string",
              "enum": [
                "attraction",
                "hotel",
                "restaurant",
                "cafe"
              ]
            },
            "description": "Loại địa điểm"
          },
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID của địa điểm"
          }
        ],
        "responses": {
          "200": {
            "description": "Thành công"
          },
          "404": {
            "description": "Không tìm thấy địa điểm"
          }
        }
      }
    },
    "/favorites": {
      "get": {
        "summary": "Lấy danh sách địa điểm yêu thích của tôi (Yêu cầu Đăng nhập)",
        "tags": [
          "Favorites"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Lấy danh sách thành công",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "total": {
                      "type": "integer"
                    },
                    "favorites": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Favorite"
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Chưa đăng nhập"
          }
        }
      },
      "post": {
        "summary": "Thêm địa điểm vào danh sách yêu thích (Yêu cầu Đăng nhập)",
        "tags": [
          "Favorites"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "itemType",
                  "itemId"
                ],
                "properties": {
                  "itemType": {
                    "type": "string",
                    "enum": [
                      "Attraction",
                      "Hotel",
                      "Restaurant",
                      "Cafe"
                    ]
                  },
                  "itemId": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Thêm thành công"
          },
          "400": {
            "description": "Thiếu thông tin hoặc đã lưu trước đó"
          },
          "401": {
            "description": "Chưa đăng nhập"
          }
        }
      }
    },
    "/favorites/{id}": {
      "delete": {
        "summary": "Hủy lưu địa điểm yêu thích (Yêu cầu Đăng nhập)",
        "tags": [
          "Favorites"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID của bản ghi yêu thích cần xóa"
          }
        ],
        "responses": {
          "200": {
            "description": "Xóa thành công"
          },
          "401": {
            "description": "Chưa đăng nhập hoặc không có quyền"
          },
          "404": {
            "description": "Không tìm thấy bản ghi yêu thích"
          }
        }
      }
    },
    "/cities": {
      "get": {
        "summary": "Lấy danh sách toàn bộ thành phố",
        "description": "Trả về danh sách tất cả các thành phố đang được hỗ trợ trong hệ thống (công khai).",
        "tags": [
          "Cities"
        ],
        "responses": {
          "200": {
            "description": "Trả về danh sách thành phố thành công",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "total": {
                      "type": "number"
                    },
                    "cities": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/City"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/cities/{id}": {
      "get": {
        "summary": "Lấy thông tin chi tiết một thành phố theo ID",
        "tags": [
          "Cities"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID của thành phố cần xem chi tiết"
          }
        ],
        "responses": {
          "200": {
            "description": "Thành công",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/City"
                }
              }
            }
          },
          "404": {
            "description": "Không tìm thấy thành phố"
          }
        }
      }
    },
    "/auth/register": {
      "post": {
        "summary": "Đăng ký người dùng mới",
        "tags": [
          "Auth"
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "name",
                  "email",
                  "password"
                ],
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "email": {
                    "type": "string"
                  },
                  "password": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Đăng ký thành công và trả về thông tin user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "400": {
            "description": "Dữ liệu không hợp lệ hoặc User đã tồn tại"
          }
        }
      }
    },
    "/auth/login": {
      "post": {
        "summary": "Đăng nhập người dùng",
        "tags": [
          "Auth"
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "email",
                  "password"
                ],
                "properties": {
                  "email": {
                    "type": "string"
                  },
                  "password": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Đăng nhập thành công, trả về thông tin user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "401": {
            "description": "Sai email hoặc mật khẩu"
          }
        }
      }
    },
    "/auth/logout": {
      "post": {
        "summary": "Đăng xuất người dùng (xóa cookie token)",
        "tags": [
          "Auth"
        ],
        "responses": {
          "200": {
            "description": "Đăng xuất thành công"
          }
        }
      }
    },
    "/auth/profile": {
      "get": {
        "summary": "Lấy thông tin cá nhân của người dùng hiện tại",
        "tags": [
          "Auth"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Trả về thông tin cá nhân của user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "401": {
            "description": "Chưa xác thực (Không có token)"
          }
        }
      },
      "put": {
        "summary": "Cập nhật thông tin cá nhân người dùng hiện tại",
        "tags": [
          "Auth"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "avatar": {
                    "type": "string"
                  },
                  "phone": {
                    "type": "string"
                  },
                  "gender": {
                    "type": "string",
                    "enum": [
                      "Nam",
                      "Nữ",
                      "Khác",
                      ""
                    ]
                  },
                  "dateOfBirth": {
                    "type": "string",
                    "format": "date"
                  },
                  "travelPreferences": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  },
                  "favoriteBudget": {
                    "type": "string",
                    "enum": [
                      "Tiết kiệm",
                      "Trung bình",
                      "Cao cấp",
                      ""
                    ]
                  },
                  "password": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Cập nhật thành công, trả về thông tin user mới",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "401": {
            "description": "Chưa xác thực"
          },
          "404": {
            "description": "Không tìm thấy User"
          }
        }
      }
    },
    "/auth/verify-otp": {
      "post": {
        "summary": "Xác thực mã OTP đăng ký tài khoản",
        "tags": [
          "Auth"
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "email",
                  "otp"
                ],
                "properties": {
                  "email": {
                    "type": "string"
                  },
                  "otp": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Xác thực thành công, đăng nhập luôn và trả về thông tin user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "400": {
            "description": "Mã OTP sai hoặc đã hết hạn"
          }
        }
      }
    },
    "/auth/resend-otp": {
      "post": {
        "summary": "Gửi lại mã OTP xác thực",
        "tags": [
          "Auth"
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "email"
                ],
                "properties": {
                  "email": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Gửi lại mã thành công"
          }
        }
      }
    },
    "/auth/forgot-password": {
      "post": {
        "summary": "Yêu cầu gửi OTP để quên mật khẩu",
        "tags": [
          "Auth"
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "email"
                ],
                "properties": {
                  "email": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Gửi mã OTP thành công đến email"
          }
        }
      }
    },
    "/auth/reset-password": {
      "post": {
        "summary": "Đặt lại mật khẩu bằng mã OTP",
        "tags": [
          "Auth"
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "email",
                  "otp",
                  "newPassword"
                ],
                "properties": {
                  "email": {
                    "type": "string"
                  },
                  "otp": {
                    "type": "string"
                  },
                  "newPassword": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Đặt lại mật khẩu thành công"
          }
        }
      }
    },
    "/api/ai/chat": {
      "post": {
        "summary": "Trò chuyện tự do với Trợ lý ảo AI",
        "description": "Nhận tin nhắn của người dùng và lịch sử hội thoại, gửi lên Gemini API để trả về câu trả lời tự nhiên dạng văn bản.",
        "tags": [
          "AI Assistant"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "message"
                ],
                "properties": {
                  "message": {
                    "type": "string",
                    "description": "Tin nhắn gửi lên AI",
                    "example": "Hạ Long có những điểm du lịch nào nổi tiếng?"
                  },
                  "history": {
                    "type": "array",
                    "description": "Lịch sử cuộc hội thoại (tùy chọn)",
                    "items": {
                      "type": "object",
                      "properties": {
                        "role": {
                          "type": "string",
                          "enum": [
                            "user",
                            "assistant"
                          ]
                        },
                        "parts": {
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "text": {
                                "type": "string"
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Câu trả lời của AI",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "reply": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Chưa đăng nhập"
          },
          "429": {
            "description": "AI vượt quá giới hạn yêu cầu (Quota Limit)"
          }
        }
      },
      "get": {
        "summary": "Tải lịch sử trò chuyện của người dùng hiện tại",
        "description": "Lấy danh sách các tin nhắn đã trò chuyện giữa người dùng và AI được lưu trong cơ sở dữ liệu.",
        "tags": [
          "AI Assistant"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Danh sách lịch sử tin nhắn",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "role": {
                        "type": "string",
                        "enum": [
                          "user",
                          "model"
                        ]
                      },
                      "parts": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "text": {
                              "type": "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Chưa đăng nhập"
          },
          "500": {
            "description": "Lỗi server"
          }
        }
      },
      "delete": {
        "summary": "Xóa toàn bộ lịch sử trò chuyện của người dùng hiện tại",
        "description": "Xóa vĩnh viễn tài liệu lưu trữ cuộc trò chuyện của người dùng khỏi cơ sở dữ liệu.",
        "tags": [
          "AI Assistant"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Xóa lịch sử thành công",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Đã xóa lịch sử cuộc trò chuyện."
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Chưa đăng nhập"
          },
          "500": {
            "description": "Lỗi server"
          }
        }
      }
    },
    "/api/ai/suggest": {
      "post": {
        "summary": "Gợi ý lịch trình du lịch thông minh bằng AI",
        "description": "Nhận yêu cầu của người dùng, lấy địa điểm thực tế từ cơ sở dữ liệu và gọi Gemini 2.5 Flash để sinh lịch trình gợi ý dạng JSON chuẩn. Có thể truyền trực tiếp cityId hoặc tin nhắn tự do để tự phát hiện thành phố.",
        "tags": [
          "AI Assistant"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "cityId": {
                    "type": "string",
                    "description": "ID của thành phố đích trong Database (không bắt buộc nếu gõ tin nhắn tự do)",
                    "example": "6a4fb11ab3962de0d90efa6e"
                  },
                  "startDate": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Ngày bắt đầu chuyến đi (mặc định hôm nay)",
                    "example": "2026-08-05T00:00:00.000Z"
                  },
                  "endDate": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Ngày kết thúc chuyến đi (mặc định hôm nay + 2 ngày)",
                    "example": "2026-08-08T00:00:00.000Z"
                  },
                  "budget": {
                    "type": "string",
                    "description": "Phân khúc ngân sách mong muốn",
                    "enum": [
                      "Tiết kiệm",
                      "Trung bình",
                      "Sang trọng"
                    ],
                    "example": "Trung bình"
                  },
                  "preferences": {
                    "type": "string",
                    "description": "Sở thích hoặc phong cách du lịch",
                    "example": "Biển, ngắm cảnh hoàng hôn, ăn hải sản"
                  },
                  "notes": {
                    "type": "string",
                    "description": "Lời nhắn/yêu cầu thêm từ người dùng (hoặc lời nhắn chứa tên thành phố tự phát hiện, hoặc văn bản lịch trình chữ cần phân tích)",
                    "example": "Tôi muốn đi du lịch Phú Quốc vào tuần tới"
                  },
                  "isParse": {
                    "type": "boolean",
                    "description": "Cờ xác định chế độ: true nếu là phân tích lịch trình dạng chữ từ chat, false nếu là sinh mới tự động",
                    "example": false
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Gợi ý lịch trình thành công dưới dạng JSON chuẩn khớp với Trip schema",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean",
                      "example": true
                    },
                    "city": {
                      "type": "object",
                      "properties": {
                        "_id": {
                          "type": "string"
                        },
                        "name": {
                          "type": "string"
                        },
                        "image": {
                          "type": "string"
                        }
                      }
                    },
                    "suggestedTitle": {
                      "type": "string",
                      "example": "Hành trình nghỉ dưỡng 3 ngày tại Phú Quốc"
                    },
                    "estimatedTotalCost": {
                      "type": "number",
                      "example": 4500000
                    },
                    "schedule": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "day": {
                            "type": "integer",
                            "example": 1
                          },
                          "places": {
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "placeType": {
                                  "type": "string",
                                  "enum": [
                                    "Hotel",
                                    "Attraction",
                                    "Restaurant",
                                    "Cafe"
                                  ]
                                },
                                "placeId": {
                                  "type": "string",
                                  "example": "6a4fb11ab3962de0d90efa8a"
                                },
                                "order": {
                                  "type": "integer",
                                  "example": 0
                                },
                                "note": {
                                  "type": "string",
                                  "example": "Nhận phòng khách sạn và nghỉ ngơi"
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Lỗi không tìm thấy thành phố hoặc tham số thiếu"
            },
            "429": {
              "description": "AI vượt quá hạn mức yêu cầu (Quota Limit)"
            },
            "500": {
              "description": "Lỗi server hoặc lỗi kết nối Gemini API"
            }
          }
        }
      }
    },
    "/api/ai/optimize/{tripId}": {
      "post": {
        "summary": "Tối ưu hóa thứ tự di chuyển lịch trình hiện có",
        "description": "Nhận ID chuyến đi hiện tại, gửi tọa độ địa lý của các địa điểm lên Gemini để AI tính toán và sắp xếp lại thứ tự di chuyển tối ưu nhất.",
        "tags": [
          "AI Assistant"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "tripId",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID của chuyến đi cần tối ưu"
          }
        ],
        "requestBody": {
          "required": false,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "notes": {
                    "type": "string",
                    "description": "Yêu cầu tối ưu hóa đặc biệt từ người dùng",
                    "example": "Hãy sắp xếp các quán cafe vào buổi sáng nhé"
                  },
                  "preview": {
                    "type": "boolean",
                    "description": "Cờ xác định chế độ xem trước (true) hay lưu thực tế vào DB (false)",
                    "example": true
                  },
                  "optimizedSchedule": {
                    "type": "array",
                    "description": "Lịch trình đã tối ưu (được cache từ bản xem trước) dùng để lưu trực tiếp vào DB khi preview=false",
                    "items": {
                      "type": "object"
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Tối ưu lịch trình thành công và trả về thông tin chuyến đi đã cập nhật"
          },
          "404": {
            "description": "Chuyến đi không tồn tại hoặc không thuộc về người dùng"
          },
          "500": {
            "description": "Lỗi server hoặc lỗi kết nối Gemini API"
          }
        }
      }
    },
    "/admin/users": {
      "get": {
        "summary": "Lấy danh sách toàn bộ người dùng (Admin)",
        "tags": [
          "Admin - User"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Danh sách người dùng",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Chưa xác thực"
          },
          "403": {
            "description": "Không có quyền Admin"
          }
        }
      }
    },
    "/admin/users/{id}": {
      "get": {
        "summary": "Lấy thông tin chi tiết người dùng theo ID (Admin)",
        "tags": [
          "Admin - User"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Chi tiết người dùng",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "401": {
            "description": "Chưa xác thực"
          },
          "403": {
            "description": "Không có quyền Admin"
          },
          "404": {
            "description": "Không tìm thấy người dùng"
          }
        }
      },
      "put": {
        "summary": "Khóa/Mở khóa tài khoản người dùng (Admin)",
        "tags": [
          "Admin - User"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "email": {
                    "type": "string"
                  },
                  "isAdmin": {
                    "type": "boolean"
                  },
                  "isBlocked": {
                    "type": "boolean"
                  }
                }
              }
            },
            "example": {
              "name": "John Doe Updated",
              "email": "john_updated@example.com",
              "isAdmin": false,
              "isBlocked": true
            }
          }
        },
        "responses": {
          "200": {
            "description": "Cập nhật thành công",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "401": {
            "description": "Chưa xác thực"
          },
          "403": {
            "description": "Không có quyền Admin"
          },
          "404": {
            "description": "Không tìm thấy người dùng"
          }
        }
      },
      "delete": {
        "summary": "Xóa người dùng (Admin)",
        "tags": [
          "Admin - User"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Xóa thành công"
          },
          "400": {
            "description": "Không thể xóa quản trị viên duy nhất"
          },
          "401": {
            "description": "Chưa xác thực"
          },
          "403": {
            "description": "Không có quyền Admin"
          },
          "404": {
            "description": "Không tìm thấy người dùng"
          }
        }
      }
    },
    "/admin/reviews": {
      "get": {
        "summary": "Lấy toàn bộ danh sách đánh giá của hệ thống (Admin)",
        "tags": [
          "Admin - Review"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "parameters": [
          {
            "in": "query",
            "name": "city",
            "schema": {
              "type": "string"
            },
            "description": "Lọc đánh giá theo ID thành phố"
          },
          {
            "in": "query",
            "name": "itemType",
            "schema": {
              "type": "string",
              "enum": [
                "Attraction",
                "Hotel",
                "Restaurant",
                "Cafe"
              ]
            },
            "description": "Lọc đánh giá theo loại địa điểm"
          },
          {
            "in": "query",
            "name": "itemId",
            "schema": {
              "type": "string"
            },
            "description": "Lọc đánh giá theo ID địa điểm cụ thể"
          }
        ],
        "responses": {
          "200": {
            "description": "Danh sách đánh giá kèm thông tin người dùng và địa điểm tương ứng",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "_id": {
                        "type": "string"
                      },
                      "user": {
                        "type": "object",
                        "properties": {
                          "name": {
                            "type": "string"
                          },
                          "email": {
                            "type": "string"
                          }
                        }
                      },
                      "rating": {
                        "type": "number"
                      },
                      "comment": {
                        "type": "string"
                      },
                      "itemId": {
                        "type": "object",
                        "properties": {
                          "name": {
                            "type": "string"
                          }
                        }
                      },
                      "itemType": {
                        "type": "string",
                        "enum": [
                          "Attraction",
                          "Hotel",
                          "Restaurant",
                          "Cafe"
                        ]
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Chưa xác thực"
          },
          "403": {
            "description": "Không có quyền Admin"
          }
        }
      }
    },
    "/admin/reviews/{id}": {
      "delete": {
        "summary": "Xóa một đánh giá không phù hợp (Admin)",
        "tags": [
          "Admin - Review"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID của đánh giá cần xóa"
          }
        ],
        "responses": {
          "200": {
            "description": "Xóa thành công",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Review removed successfully"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Chưa xác thực"
          },
          "403": {
            "description": "Không có quyền Admin"
          },
          "404": {
            "description": "Không tìm thấy đánh giá"
          }
        }
      }
    },
    "/admin/places/{type}": {
      "get": {
        "summary": "Lấy danh sách địa điểm theo loại (Admin)",
        "tags": [
          "Admin - Places"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "type",
            "required": true,
            "schema": {
              "type": "string",
              "enum": [
                "attraction",
                "hotel",
                "restaurant",
                "cafe"
              ]
            },
            "description": "Loại địa điểm cần lấy danh sách"
          },
          {
            "in": "query",
            "name": "city",
            "schema": {
              "type": "string"
            },
            "description": "(Tùy chọn) Lọc theo ID thành phố"
          }
        ],
        "responses": {
          "200": {
            "description": "Danh sách địa điểm tương ứng"
          },
          "400": {
            "description": "Loại địa điểm không hợp lệ"
          },
          "401": {
            "description": "Chưa xác thực"
          },
          "403": {
            "description": "Không có quyền Admin"
          }
        }
      },
      "post": {
        "summary": "Tạo một địa điểm mới theo loại (Admin)",
        "tags": [
          "Admin - Places"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "type",
            "required": true,
            "schema": {
              "type": "string",
              "enum": [
                "attraction",
                "hotel",
                "restaurant",
                "cafe"
              ]
            },
            "description": "Loại địa điểm cần tạo"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "oneOf": [
                  {
                    "$ref": "#/components/schemas/AttractionInput"
                  },
                  {
                    "$ref": "#/components/schemas/HotelInput"
                  },
                  {
                    "$ref": "#/components/schemas/RestaurantInput"
                  },
                  {
                    "$ref": "#/components/schemas/CafeInput"
                  }
                ]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Tạo thành công"
          },
          "400": {
            "description": "Dữ liệu gửi lên lỗi hoặc không tìm thấy City"
          },
          "401": {
            "description": "Chưa xác thực"
          },
          "403": {
            "description": "Không có quyền Admin"
          }
        }
      }
    },
    "/admin/places/{type}/{id}": {
      "get": {
        "summary": "Lấy chi tiết địa điểm theo ID và Loại (Admin)",
        "tags": [
          "Admin - Places"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "type",
            "required": true,
            "schema": {
              "type": "string",
              "enum": [
                "attraction",
                "hotel",
                "restaurant",
                "cafe"
              ]
            }
          },
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Chi tiết địa điểm"
          },
          "401": {
            "description": "Chưa xác thực"
          },
          "403": {
            "description": "Không có quyền Admin"
          },
          "404": {
            "description": "Không tìm thấy địa điểm"
          }
        }
      },
      "put": {
        "summary": "Cập nhật thông tin địa điểm (Admin)",
        "tags": [
          "Admin - Places"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "type",
            "required": true,
            "schema": {
              "type": "string",
              "enum": [
                "attraction",
                "hotel",
                "restaurant",
                "cafe"
              ]
            }
          },
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "oneOf": [
                  {
                    "$ref": "#/components/schemas/AttractionInput"
                  },
                  {
                    "$ref": "#/components/schemas/HotelInput"
                  },
                  {
                    "$ref": "#/components/schemas/RestaurantInput"
                  },
                  {
                    "$ref": "#/components/schemas/CafeInput"
                  }
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Cập nhật thành công"
          },
          "401": {
            "description": "Chưa xác thực"
          },
          "403": {
            "description": "Không có quyền Admin"
          },
          "404": {
            "description": "Không tìm thấy địa điểm hoặc thành phố"
          }
        }
      },
      "delete": {
        "summary": "Xóa địa điểm (Admin)",
        "tags": [
          "Admin - Places"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "type",
            "required": true,
            "schema": {
              "type": "string",
              "enum": [
                "attraction",
                "hotel",
                "restaurant",
                "cafe"
              ]
            }
          },
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Xóa thành công",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Place removed successfully"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Chưa xác thực"
          },
          "403": {
            "description": "Không có quyền Admin"
          },
          "404": {
            "description": "Không tìm thấy địa điểm"
          }
        }
      }
    },
    "/admin/import/vietnam-cities": {
      "get": {
        "summary": "Lấy danh sách các thành phố Việt Nam để lựa chọn",
        "tags": [
          "Admin - Import"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Danh sách thành phố thành công",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "_id": {
                        "type": "string"
                      },
                      "name": {
                        "type": "string"
                      },
                      "state": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/admin/import/osm": {
      "post": {
        "summary": "Import dữ liệu địa điểm du lịch tự động từ OpenStreetMap (Admin)",
        "tags": [
          "Admin - Import"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "cityId"
                ],
                "properties": {
                  "cityId": {
                    "type": "string",
                    "description": "ID của thành phố cần import"
                  },
                  "limit": {
                    "type": "number",
                    "description": "Giới hạn số lượng địa điểm cào cho mỗi nhóm (mặc định 30)",
                    "example": 30
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Import dữ liệu và tự động làm giàu thông tin thành công",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string"
                    },
                    "stats": {
                      "type": "object",
                      "properties": {
                        "hotelsImported": {
                          "type": "number"
                        },
                        "attractionsImported": {
                          "type": "number"
                        },
                        "restaurantsImported": {
                          "type": "number"
                        },
                        "cafesImported": {
                          "type": "number"
                        },
                        "totalImported": {
                          "type": "number"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Yêu cầu không hợp lệ hoặc thiếu tham số"
          },
          "404": {
            "description": "Không tìm thấy thành phố"
          },
          "503": {
            "description": "Máy chủ OpenStreetMap quá tải hoặc gặp sự cố"
          }
        }
      }
    },
    "/admin/dashboard/stats": {
      "get": {
        "summary": "Lấy dữ liệu thống kê tổng hợp cho trang chủ Admin Dashboard",
        "tags": [
          "Admin - Dashboard"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Thông tin thống kê người dùng, chuyến đi, địa điểm và đánh giá",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "users": {
                      "type": "number",
                      "example": 25
                    },
                    "trips": {
                      "type": "number",
                      "example": 10
                    },
                    "places": {
                      "type": "object",
                      "properties": {
                        "total": {
                          "type": "number",
                          "example": 45
                        },
                        "attractions": {
                          "type": "number",
                          "example": 15
                        },
                        "hotels": {
                          "type": "number",
                          "example": 10
                        },
                        "restaurants": {
                          "type": "number",
                          "example": 12
                        },
                        "cafes": {
                          "type": "number",
                          "example": 8
                        }
                      }
                    },
                    "reviews": {
                      "type": "number",
                      "example": 120
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Chưa xác thực"
          },
          "403": {
            "description": "Không có quyền Admin"
          }
        }
      }
    },
    "/admin/cities": {
      "get": {
        "summary": "Lấy danh sách toàn bộ thành phố (Admin)",
        "tags": [
          "Admin - City"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Danh sách thành phố",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/City"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Chưa xác thực"
          },
          "403": {
            "description": "Không có quyền Admin"
          }
        }
      },
      "post": {
        "summary": "Tạo một thành phố mới (Admin)",
        "tags": [
          "Admin - City"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CityInput"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Tạo thành công",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/City"
                }
              }
            }
          },
          "400": {
            "description": "Thành phố đã tồn tại hoặc dữ liệu thiếu"
          },
          "401": {
            "description": "Chưa xác thực"
          },
          "403": {
            "description": "Không có quyền Admin"
          }
        }
      }
    },
    "/admin/cities/{id}": {
      "get": {
        "summary": "Lấy chi tiết thành phố theo ID (Admin)",
        "tags": [
          "Admin - City"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID của thành phố"
          }
        ],
        "responses": {
          "200": {
            "description": "Chi tiết thành phố",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/City"
                }
              }
            }
          },
          "401": {
            "description": "Chưa xác thực"
          },
          "403": {
            "description": "Không có quyền Admin"
          },
          "404": {
            "description": "Không tìm thấy thành phố"
          }
        }
      },
      "put": {
        "summary": "Cập nhật thông tin thành phố (Admin)",
        "tags": [
          "Admin - City"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID của thành phố"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CityInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Cập nhật thành công",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/City"
                }
              }
            }
          },
          "401": {
            "description": "Chưa xác thực"
          },
          "403": {
            "description": "Không có quyền Admin"
          },
          "404": {
            "description": "Không tìm thấy thành phố"
          }
        }
      },
      "delete": {
        "summary": "Xóa thành phố (Admin)",
        "tags": [
          "Admin - City"
        ],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID của thành phố"
          }
        ],
        "responses": {
          "200": {
            "description": "Xóa thành công",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "City removed successfully"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Chưa xác thực"
          },
          "403": {
            "description": "Không có quyền Admin"
          },
          "404": {
            "description": "Không tìm thấy thành phố"
          }
        }
      }
    }
  },
  "tags": [
    {
      "name": "AI Assistant",
      "description": "Trợ lý ảo AI thiết lập và tối ưu lịch trình du lịch sử dụng Gemini API"
    }
  ]
}