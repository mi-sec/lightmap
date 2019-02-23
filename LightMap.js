/** ****************************************************************************************************
 * File: LightMap.js
 * Project: lightmap
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-May-2018
 *******************************************************************************************************/
'use strict';

const { version } = require( './package' );

/**
 * LightMap
 * @augments Map
 */
class LightMap extends Map
{
	constructor( n )
	{
		super( n );
		
		this.forEach(
			( v, k ) => this.set( k, this[ Symbol.constructMapByPattern ]( v ) )
		);
	}
	
	/**
	 * filter
	 * @description
	 * Filter LightMap based on keys and values based in.
	 * Comparisons can be made on the key and/or value.
	 * @param {Function} fn - comparing method
	 * @return {LightMap} - returns new LightMap with filtered results
	 * @example
	 * const _ = new LightMap();
	 * _.set( 'key', 'value' );
	 * _.set( 'key1', 'value1' );
	 *
	 * const result = _.filter(
	 *     ( v, k ) => k === 'key'
	 * );
	 *
	 * // -> LightMap { 'key' => 'value' }
	 */
	filter( fn )
	{
		const arr = new LightMap();
		
		for( const [ key, value ] of this[ Symbol.iterator ]() ) {
			if( fn( value, key, this ) ) {
				arr.set( key, value );
			}
		}
		
		return arr;
	}
	
	/**
	 * map
	 * @description
	 * Map LightMap with new key and/or value.
	 * Return the new item in a "tuple" form matching the Map paradigm (`[ x, y ]`).
	 * @param {Function} fn - map method
	 * @return {LightMap} - returns new LightMap with mapped results
	 * @example
	 * const _ = new LightMap();
	 * _.set( 'key', 'value' );
	 *
	 * const result = _.map(
	 *     ( v, k ) => [ k + 1, v + 1 ]
	 * );
	 *
	 * // -> LightMap { 'key1' => 'value1' }
	 */
	map( fn )
	{
		const arr = new LightMap();
		
		for( const [ key, value ] of this[ Symbol.iterator ]() ) {
			let entry = fn( value, key, this );
			
			if( !entry ) {
				entry = [ undefined, undefined ];
			}
			
			arr.set( entry[ 0 ] || key, entry[ 1 ] || value );
		}
		
		return arr;
	}
	
	/**
	 * reduce
	 * @description
	 * Reduce LightMap with new value.
	 * Must return the carriage value just like Array.reduce.
	 * @param {Function} fn - reducing method
	 * @param {*} r - carriage value
	 * @param {Iterator<LightMap>} iterator - `LightMap[ Symbol.iterator ]()`
	 * @return {*} - returns reduced result
	 * @example
	 * const _ = new LightMap();
	 * _.set( 'key', 'value' );
	 *
	 * const result = _.reduce(
	 *     ( r, [ k, v ] ) => {
	 *         r += `Key: ${ k }\n`;
	 *         r += `Value: ${ v }\n`;
	 *         return r;
	 *     }, ''
	 * );
	 *
	 * // -> 'Key: key\nValue: value\n'
	 */
	reduce( fn, r, iterator = this[ Symbol.iterator ]() )
	{
		for( const [ key, value ] of iterator ) {
			r = fn( r, [ key, value ], key, this );
		}
		
		return r;
	}
	
	/**
	 * find
	 * @description
	 * The `find()` method returns the tuple pair of the first element in the LightMap that satisfies the provided
	 * testing function.
	 * @param {Function} fn - find method
	 * @param {Iterator<LightMap>} iterator - `LightMap[ Symbol.iterator ]()`
	 * @return {Array<*|*>} - returns tuple result
	 * @example
	 * const _ = new LightMap();
	 * _.set( 'key', 'value' );
	 * _.set( 'key1', 'value1' );
	 *
	 * const result = _.find(
	 *     ( v, k, arr ) => {
	 *         return v === 'value';
	 *     }
	 * );
	 *
	 * // -> [ 'key', 'value' ]
	 */
	find( fn, iterator = this[ Symbol.iterator ]() )
	{
		let r;
		
		for( const [ key, value ] of iterator ) {
			if( fn( value, key, this ) ) {
				r = [ key, value ];
				break;
			}
		}
		
		return r;
	}
	
	/**
	 * findAll
	 * @description
	 * The `findAll()` method returns a LightMap of tuple pairs matching all conditions that satisfy the provided
	 * testing function.
	 * @param {Function} fn - findAll method
	 * @param {Iterator<LightMap>} iterator - `LightMap[ Symbol.iterator ]()`
	 * @return {LightMap} - returns new LightMap with matching results
	 * @example
	 * const _ = new LightMap();
	 * _.set( 'key', 'value' );
	 * _.set( 'key1', 'value' );
	 * _.set( 'key2', 'value2' );
	 *
	 * const result = _.findAll(
	 *      ( v, k, arr ) => {
	 * 			return v === 'value';
	 * 		}
	 * );
	 *
	 * // -> LightMap { 'key' => 'value', 'key1' => 'value' }
	 */
	findAll( fn, iterator = this[ Symbol.iterator ]() )
	{
		const r = new LightMap();
		
		for( const [ key, value ] of iterator ) {
			if( fn( value, key, this ) ) {
				r.set( key, value );
			}
		}
		
		return r;
	}
	
	/**
	 * sortKeys
	 * @description
	 * Map LightMap with sorted key-value pairs.
	 * @param {Function?} fn - sorting method
	 * @return {LightMap} - returns new LightMap with sorted results
	 * @example
	 * const _ = new LightMap();
	 * _.set( 'key2', 'value2' );
	 * _.set( 'key1', 'value1' );
	 * _.set( 'key', 'value' );
	 *
	 * const result = _.sortKeys();
	 *
	 * // -> LightMap { 'key' => 'value', 'key1' => 'value1', 'key2' => 'value2' }
	 */
	sortKeys( fn = ( a, b ) => String( a ).localeCompare( String( b ) ) )
	{
		const keys = [ ...this.keys() ].sort( fn );
		let i      = 0;
		
		return this.map(
			( v, k, iterator ) => {
				const key = keys[ i++ ];
				return [ key, iterator.get( key ) ];
			}
		);
	}
	
	/**
	 * sortValues
	 * @description
	 * Map LightMap with sorted key-value pairs sorted by value.
	 * @param {Function?} fn - sorting method
	 * @return {LightMap} - returns new LightMap with sorted results
	 * @example
	 * const _ = new LightMap();
	 * _.set( 'key', 'value2' );
	 * _.set( 'key1', 'value1' );
	 * _.set( 'key2', 'value' );
	 *
	 * const result = _.sortValues();
	 *
	 * // -> LightMap { 'key2' => 'value', 'key1' => 'value1', 'key' => 'value2' }
	 */
	sortValues( fn = ( a, b ) => String( a ).localeCompare( String( b ) ) )
	{
		const entries = [ ...this.entries() ].sort( ( a, b ) => fn( a[ 1 ], b[ 1 ] ) );
		let i         = 0;
		
		return this.map(
			() => {
				const [ key, value ] = entries[ i++ ];
				return [ key, value ];
			}
		);
	}
	
	// TODO: improve this later, not sufficient yet
	equals( n )
	{
		if( n instanceof LightMap ) {
			if( this.size !== n.size ) {
				return false;
			}
			
			return true;
		}
		
		return false;
	}
	
	/**
	 * version
	 * @description
	 * return LightMap module version
	 * @return {string} - returns LightMap module version
	 * @example
	 * this.version();
	 *
	 * // -> v0.0.0
	 */
	version()
	{
		return LightMap.version();
	}
	
	/**
	 * version
	 * @description
	 * return LightMap module version
	 * @return {string} - returns LightMap module version
	 * @example
	 * LightMap.version();
	 *
	 * // -> v0.0.0
	 */
	static version()
	{
		return `v${ version }`;
	}
	
	/**
	 * mapToArray
	 * @description
	 * maps a LightMap object to an array of arrays in the Map Pattern (re-constructable pattern)
	 * @return {Array} - returns array of tuple key-value pairs
	 * @example
	 *
	 * const _ = new LightMap();
	 * _.set( 'key', new LightMap( [ [ 'key1', 'value1' ] ] ) );
	 *
	 * const result = _.mapToArray();
	 *
	 * // -> [ [ 'key', [ [ 'key1', 'value1' ] ] ] ]
	 */
	mapToArray()
	{
		return this.reduce(
			( r, [ k, v ] ) => {
				if( v instanceof LightMap ) {
					v = v.toJSON();
				}
				
				r.push( [ k, v ] );
				return r;
			}, []
		);
	}
	
	/**
	 * toObject
	 * @description
	 * maps a LightMap object's keys and values to an object
	 * @return {Object} - returns Object of key-value pairs
	 * @example
	 *
	 * const _ = new LightMap();
	 * _.set( 'key', new LightMap( [ [ 'key1', 'value1' ] ] ) );
	 *
	 * const result = _.toObject();
	 *
	 * // -> { key: { key1: 'value1' } }
	 */
	// TODO: check for circular references
	toObject()
	{
		return this.reduce(
			( r, [ k, v ] ) => {
				if( v instanceof LightMap ) {
					v = v.toObject();
				}
				
				r[ k ] = v;
				return r;
			}, {}
		);
	}
	
	toJSON()
	{
		return this.mapToArray();
	}
	
	toString()
	{
		return JSON.stringify( this.mapToArray() );
	}
	
	/**
	 * indexOf
	 * @description
	 * returns the first index at which a given element can be found in the array, or -1 if it is not present
	 * @param {string} n - key name to search for
	 * @return {number} - index of the element
	 */
	indexOf( n )
	{
		let i = -1;
		
		return this.reduce(
			( r, [ k ] ) => {
				if( r === -1 ) {
					i++;
					
					if( k === n ) {
						r = i;
					}
				}
				
				return r;
			}, -1
		);
	}
	
	[ Symbol.constructMapByPattern ]( n )
	{
		return Array.isArray( n ) ?
			n.filter( i => i.length === 2 ).length === n.length ?
				Reflect.construct( LightMap, [ n ] ) :
				n : n;
	}
	
	[ Symbol.search ]( n )
	{
		return this.indexOf( n );
	}
	
	/**
	 * [ Symbol.replace ]
	 * @description
	 * symbol specifies the method that replaces matched substrings of a string
	 * @param {LightMap} n - replacement mapping for string
	 * @return {string} - string replaced with mapped values
	 */
	[ Symbol.replace ]( n )
	{
		this.forEach(
			( v, k ) => n = n.replace( k, v )
		);
		
		return n;
	}
	
	/**
	 * [ Symbol.toPrimitive ]
	 * @description
	 * symbol that specifies a function valued property that is called to convert an object to a primitive value
	 * @param {*} n - hint
	 * @return {*} - hint handler
	 */
	[ Symbol.toPrimitive ]( n )
	{
		if( n === 'string' ) {
			return this.toString();
		} else if( n === 'number' ) {
			return +this.size;
		} else if( n === 'boolean' ) {
			return !!this;
		} else {
			return this.toString();
		}
	}
	
	get [ Symbol.toStringTag ]()
	{
		return this.constructor.name;
	}
	
	static get [ Symbol.species ]()
	{
		return Map;
	}
	
	static [ Symbol.hasInstance ]( instance )
	{
		return instance.constructor.name === 'LightMap';
	}
}

module.exports = LightMap;
