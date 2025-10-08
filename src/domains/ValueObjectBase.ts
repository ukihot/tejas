/**
 * Value object base for numeric-like value objects.
 *
 * 意図:
 * - このインターフェースは数値として振る舞う Value Object を表現します。
 * - implement するクラスは内部に数値を表すプロパティを持ち、
 *   JavaScript/TypeScript の数値演算に自然に使えるようにすることを期待します。
 *
 * 主要メソッド:
 * - value: 内部の素の値
 * - valueOf(): プリミティブな値を返し、`+vo` や算術演算で自動的に使われる
 * - toNumber(): 明示的に number を取得
 * - equals(): 同等性比較
 *
 * 任意の加減乗除メソッドは implement 側で提供しても良い（戻り値は Self 型でチェーン可能にする想定）
 */
export interface ValueObjectBase<V = number> {
	/** 素の値（主要） */
	readonly value: V;

	/** プリミティブ値を返す。JS の valueOf と同等の用途 */
	valueOf(): V;

	/** 明示的に number として取り出す（V が number の場合はそのまま返す） */
	toNumber(): number;

	/** 同値判定。引数には同じ ValueObject（this）か素の値を許容する */
	equals(other: this | V): boolean;

	// 以下は任意実装。存在すればチェーン可能な演算ができる。
	add?(other: this | V): this;
	subtract?(other: this | V): this;
	multiply?(other: this | V): this;
	divide?(other: this | V): this;
}
