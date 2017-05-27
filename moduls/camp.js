var mongoose = require("mongoose");

var campSchema = new mongoose.Schema({
                                        name: String,
                                        price: String,
                                        img: String, 
                                        description: String,
                                        createdBy:{ 
                                                    id: {
                                                            type: mongoose.Schema.Types.ObjectId,
                                                            ref: "User"
                                                          },
                                                    name: String
                                                    },
                                        comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"} ]
                                    });

module.exports =  mongoose.model("Camp", campSchema);var mongoose = require("mongoose");

var campSchema = new mongoose.Schema({
                                        name: String,
                                        price: String,
                                        img: String, 
                                        description: String,
                                        createdBy:{ 
                                                    id: {
                                                            type: mongoose.Schema.Types.ObjectId,
                                                            ref: "User"
                                                          },
                                                    name: String
                                                    },
                                        comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"} ]
                                    });

module.exports =  mongoose.model("Camp", campSchema);