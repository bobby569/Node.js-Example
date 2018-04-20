const request = require('supertest');
const express = require('express');

const { app } = require('./server');

it('Expect hello world', done => {
	request(app)
		.get('/')
		.expect('Hello world')
		.expect('Content-Type', /html/)
		.expect(200, done);
});

it('Expect Users Object', done => {
	request(app)
		.get('/users')
		.expect('Content-Type', /json/)
		.expect(200, done);
});
