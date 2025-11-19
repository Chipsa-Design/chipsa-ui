import assert from 'node:assert';
import { describe, it } from 'node:test';
import { ObjectPlacement } from './ObjectPlacement';

describe('ObjectPlacement', () => {
    const placement = new ObjectPlacement();

    it("should calculate 'contain' correctly", () => {
        const size = placement.calc({
            object: { width: 100, height: 100 },
            container: { width: 300, height: 200 },
            position: ['center'],
            fit: 'contain',
        });

        assert.deepEqual(size, {
            width: 200,
            height: 200,
            x: 50,
            y: 0,
        });
    });

    it("should calculate 'cover' correctly", () => {
        const size = placement.calc({
            object: { width: 100, height: 100 },
            container: { width: 300, height: 200 },
            position: ['center'],
            fit: 'cover',
        });

        assert.deepEqual(size, {
            width: 300,
            height: 300,
            x: 0,
            y: -50,
        });
    });

    it("should calculate 'fill' correctly", () => {
        const size = placement.calc({
            object: { width: 100, height: 200 },
            container: { width: 300, height: 200 },
            position: ['top', 'left'],
            fit: 'fill',
        });

        assert.deepEqual(size, {
            width: 300,
            height: 200,
            x: 0,
            y: 0,
        });
    });

    it("should calculate 'none' correctly", () => {
        const size = placement.calc({
            object: { width: 50, height: 50 },
            container: { width: 200, height: 200 },
            position: ['center'],
            fit: 'none',
        });

        assert.deepEqual(size, {
            width: 50,
            height: 50,
            x: 75,
            y: 75,
        });
    });

    it("should calculate 'scale-down' when smaller than container", () => {
        const size = placement.calc({
            object: { width: 50, height: 50 },
            container: { width: 200, height: 200 },
            position: ['center'],
            fit: 'scale-down',
        });

        assert.deepEqual(size, {
            width: 50,
            height: 50,
            x: 75,
            y: 75,
        });
    });

    it("should calculate 'scale-down' when larger than container", () => {
        const size = placement.calc({
            object: { width: 500, height: 500 },
            container: { width: 200, height: 100 },
            position: ['center'],
            fit: 'scale-down',
        });

        assert.deepEqual(size, {
            width: 100,
            height: 100,
            x: 50,
            y: 0,
        });
    });

    it('should handle percentage positions', () => {
        const size = placement.calc({
            object: { width: 50, height: 50 },
            container: { width: 200, height: 200 },
            position: ['0%', '100%'],
            fit: 'none',
        });

        assert.deepEqual(size, {
            width: 50,
            height: 50,
            x: 0,
            y: 150,
        });
    });

    it('should handle single keyword position', () => {
        const size = placement.calc({
            object: { width: 50, height: 50 },
            container: { width: 200, height: 200 },
            position: ['top'],
            fit: 'none',
        });

        assert.deepEqual(size, {
            width: 50,
            height: 50,
            x: 75,
            y: 0,
        });
    });

    it('should handle mixed keywords', () => {
        const size = placement.calc({
            object: { width: 50, height: 50 },
            container: { width: 200, height: 200 },
            position: ['right', 'bottom'],
            fit: 'none',
        });

        assert.deepEqual(size, {
            width: 50,
            height: 50,
            x: 150,
            y: 150,
        });
    });

    it('should handle numeric pixel offsets', () => {
        const size = placement.calc({
            object: { width: 50, height: 50 },
            container: { width: 200, height: 200 },
            position: ['50px', '100px'],
            fit: 'none',
        });

        assert.deepEqual(size, {
            width: 50,
            height: 50,
            x: 50,
            y: 100,
        });
    });
    it('should position at top-left', () => {
        const size = placement.calc({
            object: { width: 50, height: 50 },
            container: { width: 200, height: 200 },
            position: ['left', 'top'],
            fit: 'none',
        });

        assert.deepEqual(size, {
            width: 50,
            height: 50,
            x: 0,
            y: 0,
        });
    });

    it('should position at top-center', () => {
        const size = placement.calc({
            object: { width: 50, height: 50 },
            container: { width: 200, height: 200 },
            position: ['center', 'top'],
            fit: 'none',
        });

        assert.deepEqual(size, {
            width: 50,
            height: 50,
            x: 75,
            y: 0,
        });
    });

    it('should position at top-right', () => {
        const size = placement.calc({
            object: { width: 50, height: 50 },
            container: { width: 200, height: 200 },
            position: ['right', 'top'],
            fit: 'none',
        });

        assert.deepEqual(size, {
            width: 50,
            height: 50,
            x: 150,
            y: 0,
        });
    });

    it('should position at middle-left', () => {
        const size = placement.calc({
            object: { width: 50, height: 50 },
            container: { width: 200, height: 200 },
            position: ['left', 'center'],
            fit: 'none',
        });

        assert.deepEqual(size, {
            width: 50,
            height: 50,
            x: 0,
            y: 75,
        });
    });

    it('should position at center-center', () => {
        const size = placement.calc({
            object: { width: 50, height: 50 },
            container: { width: 200, height: 200 },
            position: ['center', 'center'],
            fit: 'none',
        });

        assert.deepEqual(size, {
            width: 50,
            height: 50,
            x: 75,
            y: 75,
        });
    });

    it('should position at middle-right', () => {
        const size = placement.calc({
            object: { width: 50, height: 50 },
            container: { width: 200, height: 200 },
            position: ['right', 'center'],
            fit: 'none',
        });

        assert.deepEqual(size, {
            width: 50,
            height: 50,
            x: 150,
            y: 75,
        });
    });

    it('should position at bottom-left', () => {
        const size = placement.calc({
            object: { width: 50, height: 50 },
            container: { width: 200, height: 200 },
            position: ['left', 'bottom'],
            fit: 'none',
        });

        assert.deepEqual(size, {
            width: 50,
            height: 50,
            x: 0,
            y: 150,
        });
    });

    it('should position at bottom-center', () => {
        const size = placement.calc({
            object: { width: 50, height: 50 },
            container: { width: 200, height: 200 },
            position: ['center', 'bottom'],
            fit: 'none',
        });

        assert.deepEqual(size, {
            width: 50,
            height: 50,
            x: 75,
            y: 150,
        });
    });

    it('should position at bottom-right', () => {
        const size = placement.calc({
            object: { width: 50, height: 50 },
            container: { width: 200, height: 200 },
            position: ['right', '100%'],
            fit: 'none',
        });

        assert.deepEqual(size, {
            width: 50,
            height: 50,
            x: 150,
            y: 150,
        });
    });

    it("should handle object larger than container with 'none' fit", () => {
        const size = placement.calc({
            object: { width: 400, height: 300 },
            container: { width: 200, height: 200 },
            position: ['center'],
            fit: 'none',
        });

        assert.deepEqual(size, {
            width: 400,
            height: 300,
            x: -100,
            y: -50,
        });
    });
});
