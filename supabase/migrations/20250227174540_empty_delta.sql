/*
  # Crear tabla de gastos

  1. Nueva Tabla
    - `expenses`
      - `id` (uuid, clave primaria)
      - `user_id` (uuid, referencia al usuario)
      - `amount` (decimal, monto del gasto)
      - `description` (texto, descripción del gasto)
      - `category` (texto, categoría del gasto)
      - `date` (timestamp, fecha del gasto)
      - `created_at` (timestamp, fecha de creación)
  2. Seguridad
    - Habilitar RLS en la tabla `expenses`
    - Añadir política para que los usuarios autenticados puedan leer sus propios datos
    - Añadir política para que los usuarios autenticados puedan insertar sus propios datos
    - Añadir política para que los usuarios autenticados puedan actualizar sus propios datos
    - Añadir política para que los usuarios autenticados puedan eliminar sus propios datos
*/

CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  amount decimal NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Política para leer gastos propios
CREATE POLICY "Los usuarios pueden leer sus propios gastos"
  ON expenses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Política para insertar gastos propios
CREATE POLICY "Los usuarios pueden insertar sus propios gastos"
  ON expenses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Política para actualizar gastos propios
CREATE POLICY "Los usuarios pueden actualizar sus propios gastos"
  ON expenses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Política para eliminar gastos propios
CREATE POLICY "Los usuarios pueden eliminar sus propios gastos"
  ON expenses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Índice para mejorar el rendimiento de las consultas por usuario
CREATE INDEX IF NOT EXISTS expenses_user_id_idx ON expenses (user_id);

-- Índice para mejorar el rendimiento de las consultas por fecha
CREATE INDEX IF NOT EXISTS expenses_date_idx ON expenses (date);