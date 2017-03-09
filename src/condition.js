import { Expression } from './expression';
import _ from 'lodash';

export const ConditionType = {
  And: 'and',
  Or: 'or',
  Not: 'not'
};

export class Condition {
  constructor(attrs, schema) {
    attrs = attrs || {};

    this._type = attrs.type || ConditionType.And;
    this._schema = schema;
    this._expressions = [];

    if (attrs.expressions) {
      this._expressions = attrs.expressions.filter(o => o).map((o) => {
        if (o.expressions) {
          return new Condition(o, schema);
        }

        return new Expression(o, schema);
      });
    }

    this.ensureEmptyExpression();
  }

  get type() {
    return this._type;
  }

  set type(type) {
    this._type = type;
  }

  get expressions() {
    return this._expressions;
  }

  addEmptyCondition() {
    const condition = new Condition({}, this._schema);

    condition.addEmptyExpression();

    this._expressions.push(condition);
  }

  removeCondition(condition) {
    this._expressions = _.without(this._expressions, condition);
  }

  ensureEmptyExpression() {
    let hasEmpty = false;

    for (const expression of this._expressions) {
      if (!expression.field) {
        hasEmpty = true;
        break;
      }
    }

    if (!hasEmpty) {
      this.addEmptyExpression();
    }
  }

  addEmptyExpression() {
    this._expressions.push(new Expression({}, this._schema));
  }

  removeExpression(expression) {
    this._expressions = _.without(this._expressions, expression);
  }

  toJSON() {
    const expressions = this.expressions.map(o => o.toJSON()).filter(o => o);

    if (!expressions.length) {
      return null;
    }

    return {
      type: this.type,
      expressions: expressions
    };
  }

  get allExpressions() {
    const expressions = [];

    for (const o of this.expressions) {
      if (o.expressions) {
        expressions.push.apply(expressions, o.allExpressions);
      } else {
        expressions.push(o);
      }
    }

    return expressions;
  }

  toHumanDescription(topLevel = false) {
    if (this.expressions.length === 0) {
      return null;
    }

    const descriptions = [];

    for (const expression of this.expressions) {
      const desc = expression.toHumanDescription();

      if (desc) {
        descriptions.push(desc);
      }
    }

    if (descriptions.length === 0) {
      return null;
    }

    if (this.type === 'not') {
      return '(NOT ' + descriptions.join(' AND ') + ')';
    }

    return '(' + descriptions.join(' ' + this.type.toUpperCase() + ' ') + ')';
  }
}
