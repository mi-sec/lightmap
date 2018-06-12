/** ****************************************************************************************************
 * File: LightMap.js
 * Project: lightmap
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-May-2018
 *******************************************************************************************************/
'use strict';

const { version } = require( './package' );

class LightMap extends Map
{
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

	reduce( fn, r, iterator = this[ Symbol.iterator ]() )
	{
		for( const [ key, value ] of iterator ) {
			r = fn( r, [ key, value ], key, this );
		}

		return r;
	}

	sortKeys( fn )
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

	// TODO::: [sortValues] get back to this
	// sortValues( fn )
	// {
	// 	const
	// 		iterator = this[ Symbol.iterator ](),
	// 		arr      = [];
	//
	// 	let
	// 		done    = false,
	// 		current = null,
	// 		next    = null;
	//
	// 	while( !done ) {
	// 		if( !current ) {
	// 			current = iterator.next();
	// 		}
	//
	// 		next = iterator.next();
	// 		done = next.done;
	//
	// 		if( done ) {
	// 			return;
	// 		}
	//
	// 		const x = fn.call( arr, current.value[ 1 ], next.value[ 1 ] );
	//
	// 		console.log( x );
	// 		current = next;
	// 	}
	//
	// 	return arr;
	// }

	static version()
	{
		return `v${ version }`;
	}

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

	toJSON()
	{
		return this.mapToArray();
	}

	toString()
	{
		return JSON.stringify( this.mapToArray() );
	}

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

	// TODO::: [equals] get back to this
	// equals( n )
	// {
	// 	if( n instanceof LightMap ) {
	// 		if( this.size !== n ) {
	// 			return false;
	// 		}
	// 	}
	// 	return false;
	// }

	[ Symbol.search ]( n )
	{
		return this.indexOf( n );
	}

	[ Symbol.replace ]( n )
	{
		return this.reduce(
			( r, [ k, v ] ) => {
				r = r.replace( k, v );
				return r;
			}, n
		);
	}

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
