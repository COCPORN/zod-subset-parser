const { parseZodString } = require('./dist/zod3/index.js');

console.log('🔬 Testing z.record() parsing...');

try {
  const schema1 = 'z.record(z.string())';
  console.log('Testing:', schema1);
  const result1 = parseZodString(schema1);
  console.log('✅ Success:', typeof result1);
} catch (error) {
  console.log('❌ Failed:', error.message);
}

try {
  const schema2 = 'z.record(z.string(), z.string())';
  console.log('Testing:', schema2);
  const result2 = parseZodString(schema2);
  console.log('✅ Success:', typeof result2);
} catch (error) {
  console.log('❌ Failed:', error.message);
}

try {
  const schema3 = 'z.object({ test: z.record(z.string(), z.object({ type: z.string() })) })';
  console.log('Testing:', schema3);
  const result3 = parseZodString(schema3);
  console.log('✅ Success:', typeof result3);
} catch (error) {
  console.log('❌ Failed:', error.message);
}