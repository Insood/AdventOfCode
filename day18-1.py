import ply.lex as lex
import ply.yacc as yacc

tokens = (
  'NUMBER',
  'PLUS',
  'TIMES',
  'LPAREN',
  'RPAREN',
)

t_PLUS    = r'\+'
t_TIMES   = r'\*'
t_LPAREN  = r'\('
t_RPAREN  = r'\)'

def t_NUMBER(t):
  r'\d+'
  t.value = int(t.value)
  return t

t_ignore  = ' \t'

def t_error(t):
  print("Illegal character '%s'" % t.value[0])
  t.lexer.skip(1)

lexer = lex.lex()

def p_expression_plus(p):
    'expression : expression PLUS term'
    p[0] = p[1] + p[3]

def p_expression_term(p):
    'expression : term'
    p[0] = p[1]

def p_expression_times(p):
    'expression : expression TIMES factor'
    p[0] = p[1] * p[3]

def p_term_factor(p):
    'term : factor'
    p[0] = p[1]

def p_factor_num(p):
    'factor : NUMBER'
    p[0] = p[1]

def p_factor_expr(p):
    'factor : LPAREN expression RPAREN'
    p[0] = p[2]

# Error rule for syntax errors
def p_error(p):
    print("Syntax error in input!")

# Build the parser
parser = yacc.yacc()

with open("day18.txt") as f:
  lines = f.readlines()

sum = 0
for line in lines:
  equation = line.strip()
  print(equation)
  result = parser.parse(equation)
  sum += result

print(sum)