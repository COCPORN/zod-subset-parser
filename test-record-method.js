const { parseZodString } = require('./dist/zod3/index.js');

console.log('🔬 Testing .record() as method call...');

try {
  const schema = 'z.string().record()';
  console.log('Testing:', schema);
  const result = parseZodString(schema);
  console.log('✅ Success:', typeof result);
} catch (error) {
  console.log('❌ Failed:', error.message);
}

try {
  const schema2 = 'z.object({}).record(z.string())';
  console.log('Testing:', schema2);
  const result2 = parseZodString(schema2);
  console.log('✅ Success:', typeof result2);
} catch (error) {
  console.log('❌ Failed:', error.message);
}