using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;

namespace BitmapBWFunction
{
    public class BitmapModel
    {
        public string Title { get; set; }
        public string Content { get; set; }
    }

    public static class ProcessBitmap
    {
        [FunctionName("ProcessBitmap")]
        public static async Task<IActionResult> RunAsync(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)]
            HttpRequest req, ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            BitmapModel bitmap = JsonConvert.DeserializeObject<BitmapModel>(requestBody);

            var bytes = Convert.FromBase64String(bitmap.Content);

            try
            {
                var image = new Bitmap(new MemoryStream(bytes));

                var modifiedBitmap = await ConvertBitmapToBlackAndWhiteAsync(image);
                return new OkObjectResult(BitmapToModel(modifiedBitmap));
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex.Message);
            }
        }

        private static Task<Bitmap> ConvertBitmapToBlackAndWhiteAsync(Bitmap image)
        {
            return Task.Run(() => ConvertBitmapToBlackAndWhite(image));
        }

        private static Bitmap ConvertBitmapToBlackAndWhite(Bitmap image)
        {
            for (int row = 0; row < image.Height; row++)
            {
                for (int col = 0; col < image.Width; col++)
                {
                    Color pixel = image.GetPixel(col, row);
                    int val = (pixel.R + pixel.B + pixel.G) / 3;
                    Color newPixel = Color.FromArgb(pixel.A, val, val, val);
                    image.SetPixel(col, row, newPixel);
                }
            }

            return image;
        }

        private static BitmapModel BitmapToModel(Bitmap image)
        {
            using var stream = new MemoryStream();
            image.Save(stream, ImageFormat.Jpeg);
            var base64String = Convert.ToBase64String(stream.ToArray());
            BitmapModel model = new BitmapModel()
            {
                Title = "Result",
                Content = base64String
            };

            return model;
        }
    }
}